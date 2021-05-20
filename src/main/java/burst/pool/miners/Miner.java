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
    private AtomicReference<BurstValue> committedBalance = new AtomicReference<>();
    private AtomicReference<Double> averageCommitmentFactor = new AtomicReference<>((double) 0);
    private AtomicReference<Double> averageCommitment = new AtomicReference<>((double) 0);

    private double totalCapacity = 0;
    private double sharedCapacity = 0;

    private double boostedTotalCapacity = 0;
    private double boostedSharedCapacity = 0;

    private double effectiveTotalCapacity = 0;
    private double effectiveSharedCapacity = 0;

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
        AtomicReference<BigInteger> hitWithoutFactorSumShared = new AtomicReference<>(BigInteger.ZERO);
        AtomicReference<BigInteger> hitWithoutFactorSum = new AtomicReference<>(BigInteger.ZERO);
        AtomicInteger deadlineCount = new AtomicInteger(store.getDeadlineCount());
        List<Deadline> deadlines = store.getDeadlines();
        averageCommitmentFactor.set(0d);
        averageCommitment.set(0d);
        deadlines.forEach(deadline -> {
            averageCommitmentFactor.updateAndGet(v -> v + deadline.getCommitmentFactor());
            averageCommitment.updateAndGet(v -> v + deadline.getCommitment());
            BigInteger hit = deadline.calculateHit();
            BigInteger hitWithoutFactor = deadline.calculateHitWithoutFactor();
            hitWithoutFactorSum.set(hitWithoutFactorSum.get().add(hitWithoutFactor));
            hitSum.set(hitSum.get().add(hit));
            if(deadline.getSharePercent() > 0) {
                hit = hit.divide(BigInteger.valueOf(deadline.getSharePercent()))
                    .multiply(BigInteger.valueOf(100L));
                hitWithoutFactor = hitWithoutFactor.divide(BigInteger.valueOf(deadline.getSharePercent()))
                    .multiply(BigInteger.valueOf(100L));
            }
            else {
                // Set a very high hit to produce a zero shared capacity
                hit = BigInteger.valueOf(MinerMaths.GENESIS_BASE_TARGET * 10000L);
                hitWithoutFactor = BigInteger.valueOf(MinerMaths.GENESIS_BASE_TARGET * 10000L);
            }
            hitSumShared.set(hitSumShared.get().add(hit));
            hitWithoutFactorSumShared.set(hitWithoutFactorSumShared.get().add(hitWithoutFactor));

        });

        // Calculate estimated capacity
        try {

            averageCommitmentFactor.set(averageCommitmentFactor.get()/deadlineCount.get());
            averageCommitment.set(averageCommitment.get()/deadlineCount.get());

            //Estimated capacity calculation

            totalCapacity = minerMaths.estimatedTotalPlotSize(deadlines.size(), hitWithoutFactorSum.get());
            sharedCapacity = minerMaths.estimatedSharedPlotSize(deadlines.size(), deadlineCount.get(), hitWithoutFactorSumShared.get());

            store.setTotalCapacity(totalCapacity);
            store.setSharedCapacity(sharedCapacity);

            effectiveTotalCapacity = minerMaths.estimatedTotalPlotSize(deadlines.size(), hitSum.get());
            effectiveSharedCapacity = minerMaths.estimatedSharedPlotSize(deadlines.size(), deadlineCount.get(), hitSumShared.get());

            store.setEffectiveTotalCapacity(effectiveTotalCapacity);
            store.setEffectiveSharedCapacity(effectiveSharedCapacity);

            boostedTotalCapacity = totalCapacity * averageCommitmentFactor.get();
            boostedSharedCapacity = sharedCapacity * averageCommitmentFactor.get();

            store.setBoostedTotalCapacity(boostedTotalCapacity);
            store.setBoostedSharedCapacity(boostedSharedCapacity);

        } catch (ArithmeticException ignored) {
        }
    }

    public void recalculateShare(double poolCapacity, double sharedCapacity) {
        if (poolCapacity == 0d) {
            store.setShare(0d);
            return;
        }
        double newShare = sharedCapacity / poolCapacity;
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

    public double getEffectiveTotalCapacity() {
        return store.getEffectiveTotalCapacity();
    }
    public double getEffectiveSharedCapacity() {
        return store.getEffectiveSharedCapacity();
    }


    public double getBoostedTotalCapacity() {
        return store.getBoostedTotalCapacity();
    }

    public double getBoostedSharedCapacity() {
        return store.getBoostedSharedCapacity();
    }

    public double getAverageCommitmentFactor() {
        return averageCommitmentFactor.get();
    }
    public double getAverageCommitment() {
        return averageCommitment.get();
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

    public void setCommitment(BurstValue commitment, BurstValue comittedBalance, int height) {
        this.commitment.set(commitment);
        this.committedBalance.set(comittedBalance);
        this.commitmentHeight = height;
    }

    public BurstValue getCommitment() {
        BurstValue value = commitment.get();
        if(value == null)
            value = BurstValue.fromBurst(0);
        return value;
    }

    public BurstValue getCommittedBalance() {
        BurstValue value = committedBalance.get();
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
