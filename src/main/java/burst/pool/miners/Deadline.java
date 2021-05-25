package burst.pool.miners;

import java.math.BigInteger;

public class Deadline {
    private BigInteger deadline;
    private BigInteger deadlineWithoutFactor;
    private final BigInteger baseTarget;
    private final int sharePercent;
    private final long height;
    private final double commitmentFactor;
    private final double commitment;

    public Deadline(BigInteger deadline, BigInteger deadlineWithoutFactor, BigInteger baseTarget, int sharePercent, long height, double commitmentFactor, double commitment) {

        this.deadline = deadline;
        this.deadlineWithoutFactor = deadlineWithoutFactor;
        this.baseTarget = baseTarget;
        this.sharePercent = sharePercent;
        this.height = height;
        this.commitmentFactor = commitmentFactor;
        this.commitment = commitment;
    }

    public BigInteger getDeadline() {
        return deadline;
    }

    public BigInteger getDeadlineWithoutFactor() {
        return deadlineWithoutFactor;
    }

    public BigInteger getBaseTarget() {
        return baseTarget;
    }

    public long getHeight() {
        return height;
    }

    public double getCommitmentFactor() {
        return commitmentFactor;
    }

    public double getCommitment() {
        return commitment;
    }

    public int getSharePercent() {
      return sharePercent;
    }

    public BigInteger calculateHit() {
        return baseTarget.multiply(deadline);
    }

    public BigInteger calculateHitWithoutFactor() {
        return baseTarget.multiply(deadlineWithoutFactor);
    }

    public void setDeadline(BigInteger deadline) {
        this.deadline = deadline;
    }

    public void setDeadlineWithoutFactor(BigInteger deadlineWithoutFactor) {
        this.deadlineWithoutFactor = deadlineWithoutFactor;
    }
}
