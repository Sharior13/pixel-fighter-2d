  document.addEventListener('DOMContentLoaded', () => {
    let timeLeft = 90;
    const timerDisplay = document.getElementById('timer');

    function updateTimer() {
        if (timeLeft > 0) {
            timeLeft--;
            timerDisplay.textContent = timeLeft;
        } else {
            clearInterval(timerInterval);
            timerDisplay.textContent = '0';
            // Handle time out scenario here
        }
    }

    const timerInterval = setInterval(updateTimer, 1000);
});


        // Update health bar width (percentage of current width)
        function updateHealth(player, percentage) {
            const healthBar = document.getElementById(`health-p${player}`);
            healthBar.style.width = percentage + '%';
        }

        // Update ultimate bar width (percentage)
        function updateUltimate(player, percentage) {
            const ultimateBar = document.getElementById(`ultimate-p${player}`);
            ultimateBar.style.width = percentage + '%';
        }

        // Change health bar container width (in pixels)
        function setHealthBarWidth(player, widthInPixels) {
            const healthBarBg = document.getElementById(`health-bg-p${player}`);
            healthBarBg.style.width = widthInPixels + 'px';
        }

        // Change ultimate bar container width (in pixels)
        function setUltimateBarWidth(player, widthInPixels) {
            const ultimateBarBg = document.getElementById(`ultimate-bg-p${player}`);
            ultimateBarBg.style.width = widthInPixels + 'px';
        }

        // Example: Change the width of health bar containers
        setHealthBarWidth(1, 500); // Player 1 health bar width to 500px
        setHealthBarWidth(2, 500); // Player 2 health bar width to 500px

        // Example: Change the width of ultimate bar containers (same as health bars)
        setUltimateBarWidth(1, 500); // Player 1 ultimate bar width to 500px
        setUltimateBarWidth(2, 500); // Player 2 ultimate bar width to 500px

        // Example: Simulate damage
        // setTimeout(() => updateHealth(1, 75), 2000);
        // setTimeout(() => updateHealth(2, 50), 3000);

        // Example: Simulate ultimate charge
        // setTimeout(() => updateUltimate(1, 50), 2000);
        // setTimeout(() => updateUltimate(2, 75), 3000);