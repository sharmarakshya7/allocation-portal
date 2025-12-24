'use client';

export default function AllocationForm({
                                           styles,
                                           allocation,
                                           setAllocation,
                                           investors,
                                           addInvestor,
                                           removeInvestor,
                                           updateInvestor,
                                           handleSubmit,
                                           reset,
                                           loadExample,
                                           loading,
                                           error
                                       }) {
    return (
        <div className="container">
        <div className={styles.panel}>
            <h2>Inputs</h2>

            <form onSubmit={handleSubmit}>
      {/* Allocation */}
                <div className={styles.formGroup}>
                    <label>Total Available Allocation</label>
                    <div className={styles.inputWrapper}>
                        <span className={styles.currencySymbol}>$</span>
                        <input
                            type="number"
                            value={allocation}
                            onChange={(e) => setAllocation(e.target.value)}
                            placeholder="Allocation"
                            min="0"
                            step="1"
                        />
                    </div>
                </div>

        {/* Investors input section */}
                <div className={styles.investorSection}>
                    <div className={styles.sectionHeader}>
                        <h3>Investor Breakdown</h3>
                        <button type="button" className={styles.btnAdd} onClick={addInvestor}>
                            + Add Investor
                        </button>
                    </div>

                   {/* Investors row */}
                    <div className={styles.investorRows}>
                        {investors.map((investor, index) => (
                            <div key={index} className={styles.investorRow}>
                                <input
                                    type="text"
                                    value={investor.name}
                                    onChange={(e) => updateInvestor(index, 'name', e.target.value)}
                                    placeholder="Name"
                                    className={styles.inputName}
                                />

      {/* Requested amount */}
                                <div className={styles.inputGroup}>
                                    <span className={styles.currencySymbol}>$</span>
                                    <input
                                        type="number"
                                        value={investor.requested}
                                        onChange={(e) =>
                                            updateInvestor(index, 'requested', e.target.value)
                                        }
                                        placeholder="Requested"
                                    />
                                </div>

       {/* Average amount*/}
                                <div className={styles.inputGroup}>
                                    <span className={styles.currencySymbol}>$</span>
                                    <input
                                        type="number"
                                        value={investor.average}
                                        onChange={(e) =>
                                            updateInvestor(index, 'average', e.target.value)
                                        }
                                        placeholder="Average"
                                    />
                                </div>

         {/* Remove investor button */}

                                <button
                                    type="button"
                                    className={styles.btnRemove}
                                    onClick={() => removeInvestor(index)}
                                    disabled={investors.length === 1}
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                </div>


        {/* Display error messgae */}
                {error && <div className={styles.error}>{error}</div>}

        {/* Buttons for submit,reset and load example */}
                <div className={styles.buttonGroup}>
                    <button type="submit" className={styles.btnPrimary} disabled={loading}>
                        {loading ? 'Calculating...' : 'Prorate'}
                    </button>
                    <button type="button" className={styles.btnSecondary} onClick={reset}>
                        Reset
                    </button>
                    <button type="button" className={styles.btnSecondary} onClick={loadExample}>
                        Load Example
                    </button>
                </div>
            </form>
        </div>
        </div>
    );
}
