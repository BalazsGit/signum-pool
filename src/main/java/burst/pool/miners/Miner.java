package burst.pool.miners;

import burst.kit.entity.BurstAddress;
import burst.kit.entity.BurstValue;
import burst.pool.storage.config.PropertyService;
import burst.pool.storage.config.Props;
import burst.pool.storage.persistent.MinerStore;

import java.math.BigInteger;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicReference;

public class Miner implements Payable {
    private final MinerMaths minerMaths;
    private final PropertyService propertyService;

    private final BurstAddress address;
    private final MinerStore store;
    private int commitmentHeight;
    private AtomicReference<BurstValue> commitment = new AtomicReference<>();

    public Miner(MinerMaths minerMaths, PropertyService propertyService, BurstAddress address, MinerStore store) {
        this.minerMaths = minerMaths;
        this.propertyService = propertyService;
        this.address = address;
        this.store = store;
    }

    public void recalculateCapacity(long currentBlockHeight) {
        // Prune older deadlines
        store.getDeadlines().forEach(deadline -> {
            if (currentBlockHeight - deadline.getHeight() >= propertyService.getInt(Props.nAvg)) {
                store.removeDeadline(deadline.getHeight());
            }
        });
        // Calculate hitSum
        AtomicReference<BigInteger> hitSumShared = new AtomicReference<>(BigInteger.ZERO);
        AtomicReference<BigInteger> hitSum = new AtomicReference<>(BigInteger.ZERO);
        AtomicInteger deadlineCount = new AtomicInteger(store.getDeadlineCount());
        List<Deadline> deadlines = store.getDeadlines();
        deadlines.forEach(deadline -> {
            BigInteger hit = deadline.calculateHit();
            hitSum.set(hitSum.get().add(hit));
            hit = hit.divide(BigInteger.valueOf(deadline.getSharePercent()))
                    .multiply(BigInteger.valueOf(100L));
            hitSumShared.set(hitSumShared.get().add(hit));
        });
        // Calculate estimated capacity
        try {
            store.setSharedCapacity(minerMaths.estimatedEffectivePlotSize(deadlines.size(), deadlineCount.get(), hitSumShared.get()));
            store.setTotalCapacity(minerMaths.estimatedTotalPlotSize(deadlines.size(), hitSum.get()));
        } catch (ArithmeticException ignored) {
        }
    }

    public void recalculateShare(double poolCapacity) {
        if (poolCapacity == 0d) {
            store.setShare(0d);
            return;
        }
        double newShare = getSharedCapacity() / poolCapacity;
        if (Double.isNaN(newShare)) newShare = 0d;
        store.setShare(newShare);
    }

    @Override
    public void increasePending(BurstValue delta, Payable donationRecipient) {
        if(donationRecipient != null) {
            BurstValue donation = delta.multiply(store.getDonationPercent()/100d);
            delta = delta.subtract(donation);
            donationRecipient.increasePending(donation, null);
        }
        store.setPendingBalance(store.getPendingBalance().add(delta));
    }

    @Override
    public void decreasePending(BurstValue delta) {
        store.setPendingBalance(store.getPendingBalance().subtract(delta));
    }

    @Override
    public BurstValue getMinimumPayout() {
        return store.getMinimumPayout();
    }

    @Override
    public BurstValue takeShare(BurstValue availableReward, Payable donationRecipient) {
        BurstValue share = availableReward.multiply(store.getShare());
        increasePending(share, donationRecipient);
        return share;
    }

    public void processNewDeadline(Deadline deadline) {
        // Check if deadline is for an older block
        List<Deadline> deadlines = store.getDeadlines();
        boolean previousDeadlineExists = false;
        for (Deadline existingDeadline : deadlines) {
            if (existingDeadline.getHeight() > deadline.getHeight()) return;
            if (existingDeadline.getHeight() == deadline.getHeight()) previousDeadlineExists = true;
        }

        if (previousDeadlineExists) {
            Deadline previousDeadline = store.getDeadline(deadline.getHeight());
            if (previousDeadline == null || deadline.getDeadline().compareTo(previousDeadline.getDeadline()) < 0) { // If new deadline is better
                store.setOrUpdateDeadline(deadline.getHeight(), deadline);
            }
        } else {
            store.setOrUpdateDeadline(deadline.getHeight(), deadline);
        }
    }

    public double getSharedCapacity() {
        return store.getSharedCapacity();
    }
    

    public double getTotalCapacity() {
        return store.getTotalCapacity();
    }

    public int getSharePercent() {
        return store.getSharePercent();
    }
    public void setSharePercent(int sharePercent) {
        store.setSharePercent(sharePercent);
    }
    
    public int getDonationPercent() {
        return store.getDonationPercent();
    }
    public void setDonationPercent(int donationPercent) {
        store.setDonationPercent(donationPercent);
    }

    @Override
    public BurstValue getPending() {
        return store.getPendingBalance();
    }

    @Override
    public BurstAddress getAddress() {
        return address;
    }

    public double getShare() {
        return store.getShare();
    }

    public int getNConf() {
        return store.getDeadlineCount();
    }

    public String getName() {
        return store.getName();
    }

    public void setName(String name) {
        store.setName(name);
    }
    
    public void setCommitment(BurstValue commitment, int height) {
        this.commitment.set(commitment);
        this.commitmentHeight = height;
    }
    
    public BurstValue getCommitment() {
        BurstValue value = commitment.get();
        if(value == null)
            value = BurstValue.fromBurst(0);
        return value;
    }
    
    public int getCommitmentHeight() {
        return this.commitmentHeight;
    }
    
    public String getUserAgent() {
        return store.getUserAgent();
    }

    public void setUserAgent(String userAgent) {
        store.setUserAgent(userAgent);
    }

    public void setMinimumPayout(BurstValue minimumPayout) {
        store.setMinimumPayout(minimumPayout);
    }

    public BigInteger getBestDeadline(long height) {
        Deadline deadline = store.getDeadline(height);
        return deadline == null ? null : deadline.getDeadline();
    }
}
