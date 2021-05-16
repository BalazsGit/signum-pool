package burst.pool.miners;

import java.math.BigInteger;

public class Deadline {
    private final BigInteger deadline;
    private final BigInteger deadlineWithoutFactor;
    private final BigInteger baseTarget;
    private final int sharePercent;
    private final long height;
    private final double commitmentFactor;

    public Deadline(BigInteger deadline, BigInteger deadlineWithoutFactor, BigInteger baseTarget, int sharePercent, long height, double commitmentFactor) {

        this.deadline = deadline;
        this.deadlineWithoutFactor = deadlineWithoutFactor;
        this.baseTarget = baseTarget;
        this.sharePercent = sharePercent;
        this.height = height;
        this.commitmentFactor = commitmentFactor;
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

    public int getSharePercent() {
      return sharePercent;
    }

    public BigInteger calculateHit() {
        return baseTarget.multiply(deadline);
    }

    public BigInteger calculateHitWithoutFactor() {
        return baseTarget.multiply(deadlineWithoutFactor);
    }
}
