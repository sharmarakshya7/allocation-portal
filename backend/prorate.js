
/** Proration calculation formula for investor allocation */
function prorate(allocation_amount, investor_amounts) {
    // Initialize result object
    const result = {};


    // Calculate total requested amount across all investors
    const total_requested = investor_amounts.reduce(
        (sum, investor) => sum + investor.requested_amount,
        0
    );

    // Case 1: If total requested is less than or equal to allocation
    // Give everyone exactly what they want
    if (total_requested <= allocation_amount) {
        investor_amounts.forEach(investor => {
            result[investor.name] = investor.requested_amount;
        });
        return result;
    }

    // Case 2: prorate based on AVERAGE amounts
    // Step 1: Calculate total of all average amounts
    const total_average = investor_amounts.reduce(
        (sum, investor) => sum + investor.average_amount,
        0
    );

    // Step 2: Calculate initial allocation for each investor based on their average
    let remaining_allocation = allocation_amount;
    const allocations = [];

    investor_amounts.forEach(investor => {
        // Calculate proportional allocation based on AVERAGE amount
        // Formula: allocation_amount * (investor_average / total_average)
        const proportional_allocation =
            allocation_amount * (investor.average_amount / total_average);

        // Rule cannot exceed what they requested
        const capped_allocation = Math.min(
            proportional_allocation,
            investor.requested_amount
        );

        allocations.push({
            name: investor.name,
            amount: capped_allocation,
            requested: investor.requested_amount,
            average: investor.average_amount,
            can_take_more: capped_allocation < investor.requested_amount
        });

        remaining_allocation -= capped_allocation;
    });

    // Step 3: Distribute any remaining allocation
    // This handles cases where some investors hit their requested cap
    // Remaining funds go to those who can still accept more, proportionally by their average
    while (remaining_allocation > 0.01) {
        // Find investors who can still receive more
        const can_receive_more = allocations.filter(inv => inv.can_take_more);

        // If no one can take more, we're done
        if (can_receive_more.length === 0) {
            break;
        }

        // Calculate total average of investors who can still receive more
        const available_average = can_receive_more.reduce(
            (sum, inv) => sum + inv.average,
            0
        );

        // Distribute remaining proportionally based on average amounts
        let distributed = 0;
        can_receive_more.forEach(inv => {
            const additional_share =
                remaining_allocation * (inv.average / available_average);

            const allocation_obj = allocations.find(a => a.name === inv.name);
            const max_additional = allocation_obj.requested - allocation_obj.amount;
            const actual_additional = Math.min(additional_share, max_additional);

            allocation_obj.amount += actual_additional;
            distributed += actual_additional;

            // Update can_take_more flag
            if (allocation_obj.amount >= allocation_obj.requested - 0.01) {
                allocation_obj.can_take_more = false;
            }
        });

        remaining_allocation -= distributed;

        // Safety check to prevent infinite loop
        if (distributed < 0.01) {
            break;
        }
    }

    // Step 4: Build final result object and round to 2 decimal places
    allocations.forEach(inv => {
        result[inv.name] = Math.round(inv.amount * 100) / 100;
    });

    return result;
}

// Export the function for use in other files
module.exports = { prorate };