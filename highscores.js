const AIRTABLE_BASE_ID = 'appTmn6XZDZ3gua3l';
const AIRTABLE_TABLE_NAME = 'Scores';
const AIRTABLE_API_KEY = 'patU9oXfx5vZF5l23.753f9209713e577ccbac86cab67841163af78f6a2d7df5cab2108eca47b3a64d'

async function saveHighScore(playerName, score, slackID = null) {
    try {
        const response = await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_NAME}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                records: [{
                    fields: {
                        Name: playerName,
                        Score: score,
                        Date: new Date().toISOString().split('T')[0],
                        ...(slackID && { 'Slack ID': slackID }),
                    }
                }]
            })
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json()
        console.log('Score saved successfully: ', data);
    } catch (error) {
    console.log('Error saving score:', error);
    throw error;
    }
}

async function getHighScores(limit=10) {
    try {
        const url = new URL(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_NAME}`);
        url.searchParams.append('sort[0][field]', 'Score');
        url.searchParams.append('sort[0][direction]', 'desc');
        url.searchParams.append('maxRecords', limit.toString());

        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${AIRTABLE_API_KEY}`
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data.records
    } catch (error) {
        console.log('Error fetching high scores', error)
        throw error
    }
}

async function isHighScore(newScore, topCount = 10) {
    try {
        const highScores = await getHighScores(topCount);

        if (highScores.length < topCount) {
            return true;
        }

        const lowestHighScore = highScores[highScores.length - 1].fields.Score;    
        return newScore > lowestHighScore;
    }   catch (error) {
        console.error('Error checking if high score:', error);
        return false;
    }
}

function displayLeaderboard(scores, containerID = 'leaderboard') {
    const container = document.getElementById(containerID)
    if (!container) {
        console.error(`Container with ID '${containerID}' not found`);
        return;
    }

    let html = '<h3>High Scores</h3><ol class="leaderboard">';

    scores.forEach((record, index) => {
        const { Name, Score, Date } = record.fields;
        html +=
        <li class="leaderboard-item">
            <span class="rank">${index + 1}</span>
            <span class="name">${Name || 'Anonymous'}</span>
            <span class="score">${Score}</span>
            <span class="date">${Date}</span>
        </li>
        ;
    });

    html += '</ol>';
    container.innerHTML = html;
}

async function handleQuizComplete(playerName, finalScore, slackID = null) {
    try {
        const isHigh = await isHighScore(finalScore)

        if (isHigh) {
            await saveHighScore(playerName, finalScore, slackID)

            const highScores = await getHighScores()
            displayLeaderboard(highScores)

            alert(`Congratulations ${playerName}! You got a high score of ${finalScore}!`);
        } else {
            alert (`Good Job ${playerName}! You scored ${finalScore}. Try again to make the leaderboard!`);
        }
    } catch (error) {
        console.error('Error handling quiz completion:', error);
        alert('There was some error saving your score. Please try again.');
    }
}

async function loadLeaderboard() {
    try {
        const highScores = await getHighScores();
        displayLeaderboard(highScores);
    } catch (error) {
        console.error('Error loading leaderboard:', error)
        document.getElementById('leaderboard').innerHTML = <p>Error leading leaderboard</p>;
    }
}