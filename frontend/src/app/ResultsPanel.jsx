'use client';

export default function ResultsPanel({ styles, results }) {
    return (
        <div className={styles.panel}>
            <h2>Results</h2>

            {results ? (
 //section for showing calculated allocation //
                <div className={styles.results}>
                    {Object.entries(results).map(([name, amount]) => (
                        <div key={name} className={styles.resultItem}>
                            <span className={styles.investorName}>{name}</span>
                            <span className={styles.investorAmount}>
                ${amount.toLocaleString()}
              </span>
                        </div>
                    ))}

                    <div className={styles.resultTotal}>
                        <span className={styles.totalLabel}>Total Allocated:</span>
                        <span className={styles.totalAmount}>
              ${Object.values(results)
                            .reduce((sum, val) => sum + val, 0)
                            .toLocaleString()}
            </span>
                    </div>
                </div>
            ) : (
                <div className={styles.noResults}>
                    <p>Enter allocation and investor details, then click "Prorate".</p>
                </div>
            )}
        </div>
    );
}
