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
        })
    }
}


