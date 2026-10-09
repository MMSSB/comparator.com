document.addEventListener('DOMContentLoaded', () => {
    const btnCompare = document.getElementById('compare-btn');
    const txtOriginal = document.getElementById('text-original');
    const txtModified = document.getElementById('text-modified');
    const resultsContainer = document.getElementById('results-container');
    const diffOutput = document.getElementById('diff-output');

    if(!btnCompare) return;

    function escapeHtml(unsafe) {
        return unsafe
             .replace(/&/g, "&amp;")
             .replace(/</g, "&lt;")
             .replace(/>/g, "&gt;")
             .replace(/"/g, "&quot;")
             .replace(/'/g, "&#039;");
    }

    function tokenize(text) {
        return text.match(/(\w+|\s+|[^\w\s])/g) || [];
    }

    function computeDiff(oldStr, newStr) {
        const oldTokens = tokenize(oldStr);
        const newTokens = tokenize(newStr);
        const dp = Array(oldTokens.length + 1).fill(null).map(() => Array(newTokens.length + 1).fill(0));

        for (let i = 1; i <= oldTokens.length; i++) {
            for (let j = 1; j <= newTokens.length; j++) {
                if (oldTokens[i - 1] === newTokens[j - 1]) {
                    dp[i][j] = dp[i - 1][j - 1] + 1;
                } else {
                    dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
                }
            }
        }

        let i = oldTokens.length, j = newTokens.length;
        const diff = [];

        while (i > 0 || j > 0) {
            if (i > 0 && j > 0 && oldTokens[i - 1] === newTokens[j - 1]) {
                diff.push({ type: 'equal', value: oldTokens[i - 1] });
                i--; j--;
            } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
                diff.push({ type: 'add', value: newTokens[j - 1] });
                j--;
            } else if (i > 0 && (j === 0 || dp[i][j - 1] < dp[i - 1][j])) {
                diff.push({ type: 'remove', value: oldTokens[i - 1] });
                i--;
            }
        }
        return diff.reverse();
    }

    btnCompare.addEventListener('click', () => {
        const original = txtOriginal.value;
        const modified = txtModified.value;

        if (!original && !modified) {
            diffOutput.innerHTML = '<span class="text-muted" style="font-style: italic;">Please provide text in both fields to see a comparison.</span>';
            resultsContainer.classList.remove('hidden');
            return;
        }

        const originalText = btnCompare.innerText;
        btnCompare.innerText = "COMPARING...";
        
        setTimeout(() => {
            const diff = computeDiff(original, modified);
            let htmlOutput = '';
            
            diff.forEach(part => {
                const safeValue = escapeHtml(part.value);
                if (part.type === 'add') htmlOutput += `<ins>${safeValue}</ins>`;
                else if (part.type === 'remove') htmlOutput += `<del>${safeValue}</del>`;
                else htmlOutput += safeValue;
            });

            diffOutput.innerHTML = htmlOutput || '<span class="text-muted" style="font-style: italic;">No differences found. The texts are identical.</span>';
            resultsContainer.classList.remove('hidden');
            resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
            btnCompare.innerText = originalText;
        }, 50);
    });
});