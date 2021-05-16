/*
 * This file is generated by jOOQ.
 */
package burst.pool.db.tables.records;


import burst.pool.db.tables.MinerDeadlines;

import javax.annotation.Generated;

import org.jooq.*;
import org.jooq.impl.UpdatableRecordImpl;


/**
 * This class is generated by jOOQ.
 */
@Generated(
    value = {
        "http://www.jooq.org",
        "jOOQ version:3.11.9"
    },
    comments = "This class is generated by jOOQ"
)
@SuppressWarnings({ "all", "unchecked", "rawtypes" })
public class MinerDeadlinesRecord extends UpdatableRecordImpl<MinerDeadlinesRecord> implements Record8<Long, Long, Long, Long, Long, Integer, Double, Long> {

    private static final long serialVersionUID = 1001651253;

    /**
     * Setter for <code>miner_deadlines.db_id</code>.
     */
    public void setDbId(Long value) {
        set(0, value);
    }

    /**
     * Getter for <code>miner_deadlines.db_id</code>.
     */
    public Long getDbId() {
        return (Long) get(0);
    }

    /**
     * Setter for <code>miner_deadlines.account_id</code>.
     */
    public void setAccountId(Long value) {
        set(1, value);
    }

    /**
     * Getter for <code>miner_deadlines.account_id</code>.
     */
    public Long getAccountId() {
        return (Long) get(1);
    }

    /**
     * Setter for <code>miner_deadlines.height</code>.
     */
    public void setHeight(Long value) {
        set(2, value);
    }

    /**
     * Getter for <code>miner_deadlines.height</code>.
     */
    public Long getHeight() {
        return (Long) get(2);
    }

    /**
     * Setter for <code>miner_deadlines.deadline</code>.
     */
    public void setDeadline(Long value) {
        set(3, value);
    }

    /**
     * Getter for <code>miner_deadlines.deadline</code>.
     */
    public Long getDeadline() {
        return (Long) get(3);
    }

    /**
     * Setter for <code>miner_deadlines.base_target</code>.
     */
    public void setBaseTarget(Long value) {
        set(4, value);
    }

    /**
     * Getter for <code>miner_deadlines.base_target</code>.
     */
    public Long getBaseTarget() {
        return (Long) get(4);
    }

    /**
     * Setter for <code>miner_deadlines.share_percent</code>.
     */
    public void setSharePercent(Integer value) {
        set(5, value);
    }

    /**
     * Getter for <code>miner_deadlines.share_percent</code>.
     */
    public Integer getSharePercent() {
        return (Integer) get(5);
    }

    /**
     * Getter for <code>miner_deadlines.commitment_factor</code>.
     */
    public Double getCommitmentFactor() {
        return (Double) get(6);
    }

    /**
     * Setter for <code>miner_deadlines.commitment_factor</code>.
     */
    public void setCommitmentFactor(Double value) {
        set(6, value);
    }

    /**
     * Getter for <code>miner_deadlines.deadline_without_factor</code>.
     */
    public Long getDeadlineWithoutFactor() {
        return (Long) get(7);
    }

    /**
     * Setter for <code>miner_deadlines.deadline_without_factor</code>.
     */
    public void setDeadlineWithoutFactor(Long value) {
        set(7, value);
    }

    // -------------------------------------------------------------------------
    // Primary key information
    // -------------------------------------------------------------------------

    /**
     * {@inheritDoc}
     */
    @Override
    public Record1<Long> key() {
        return (Record1) super.key();
    }

    // -------------------------------------------------------------------------
    // Record6 type implementation
    // -------------------------------------------------------------------------

    /**
     * {@inheritDoc}
     */
    @Override
    public Row8<Long, Long, Long, Long, Long, Integer, Double, Long> fieldsRow() {
        return (Row8) super.fieldsRow();
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Row8<Long, Long, Long, Long, Long, Integer, Double, Long> valuesRow() {
        return (Row8) super.valuesRow();
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Field<Long> field1() {
        return MinerDeadlines.MINER_DEADLINES.DB_ID;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Field<Long> field2() {
        return MinerDeadlines.MINER_DEADLINES.ACCOUNT_ID;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Field<Long> field3() {
        return MinerDeadlines.MINER_DEADLINES.HEIGHT;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Field<Long> field4() {
        return MinerDeadlines.MINER_DEADLINES.DEADLINE;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Field<Long> field5() {
        return MinerDeadlines.MINER_DEADLINES.BASE_TARGET;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Field<Integer> field6() {
        return MinerDeadlines.MINER_DEADLINES.SHARE_PERCENT;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Field<Double> field7() {
        return MinerDeadlines.MINER_DEADLINES.COMMITMENT_FACTOR;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Field<Long> field8() {
        return MinerDeadlines.MINER_DEADLINES.DEADLINE_WITHOUT_FACTOR;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Long component1() {
        return getDbId();
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Long component2() {
        return getAccountId();
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Long component3() {
        return getHeight();
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Long component4() {
        return getDeadline();
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Long component5() {
        return getBaseTarget();
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Integer component6() {
        return getSharePercent();
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Double component7() {
        return getCommitmentFactor();
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Long component8() {
        return getDeadlineWithoutFactor();
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Long value1() {
        return getDbId();
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Long value2() {
        return getAccountId();
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Long value3() {
        return getHeight();
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Long value4() {
        return getDeadline();
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Long value5() {
        return getBaseTarget();
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Integer value6() {
        return getSharePercent();
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Double value7() {
        return getCommitmentFactor();
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Long value8() {
        return getDeadlineWithoutFactor();
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public MinerDeadlinesRecord value1(Long value) {
        setDbId(value);
        return this;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public MinerDeadlinesRecord value2(Long value) {
        setAccountId(value);
        return this;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public MinerDeadlinesRecord value3(Long value) {
        setHeight(value);
        return this;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public MinerDeadlinesRecord value4(Long value) {
        setDeadline(value);
        return this;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public MinerDeadlinesRecord value5(Long value) {
        setBaseTarget(value);
        return this;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public MinerDeadlinesRecord value6(Integer value) {
        setSharePercent(value);
        return this;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public MinerDeadlinesRecord value7(Double value) {
        setCommitmentFactor(value);
        return this;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public MinerDeadlinesRecord value8(Long value) {
        setDeadlineWithoutFactor(value);
        return this;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public MinerDeadlinesRecord values(Long value1, Long value2, Long value3, Long value4, Long value5, Integer value6, Double value7, Long value8) {
        value1(value1);
        value2(value2);
        value3(value3);
        value4(value4);
        value5(value5);
        value6(value6);
        value7(value7);
        value8(value8);
        return this;
    }

    // -------------------------------------------------------------------------
    // Constructors
    // -------------------------------------------------------------------------

    /**
     * Create a detached MinerDeadlinesRecord
     */
    public MinerDeadlinesRecord() {
        super(MinerDeadlines.MINER_DEADLINES);
    }

    /**
     * Create a detached, initialised MinerDeadlinesRecord
     */
    public MinerDeadlinesRecord(Long dbId, Long accountId, Long height, Long deadline, Long baseTarget, Integer sharePercent, Double commitmentFactor, Long deadlineWithoutFactor) {
        super(MinerDeadlines.MINER_DEADLINES);

        set(0, dbId);
        set(1, accountId);
        set(2, height);
        set(3, deadline);
        set(4, baseTarget);
        set(5, sharePercent);
        set(6, commitmentFactor);
        set(7, deadlineWithoutFactor);
    }
}
