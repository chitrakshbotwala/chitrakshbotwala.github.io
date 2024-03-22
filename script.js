document.getElementById('playlistForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const playlistUrl = document.getElementById('playlistUrl').value.trim();

    // Extract playlist ID from the URL
    const playlistIdMatch = playlistUrl.match(/[?&]list=([^&]+)/);
    if (!playlistIdMatch) {
        alert('Invalid YouTube Playlist URL');
        return;
    }

    const playlistId = playlistIdMatch[1];

    try {
        // Fetch playlist data using YouTube Data API
        const response = await fetch(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=50&key=AIzaSyCh_k-bSCAkO8Id6xqVQaUcipWz0z2mjaU`);
        const data = await response.json();

        if (!data.items || data.items.length === 0) {
            alert('No videos found in the playlist');
            return;
        }

        // Extract video URLs from the playlist data
        const videoUrls = data.items.map(item => `https://www.youtube.com/watch?v=${item.snippet.resourceId.videoId}`);

        // Create JSON object
        const jsonContent = JSON.stringify({
            format: "Piped",
            version: 1,
            playlists: [{
                name: `"${playlistId}"`,
                type: "playlist",
                visibility: "private",
                videos: videoUrls
            }]
        }, null, 4);

        // Create a blob containing the JSON data
        const blob = new Blob([jsonContent], { type: 'application/json' });

        // Create a temporary anchor element to download the JSON file
        const anchor = document.createElement('a');
        anchor.download = `${playlistId}.json`;
        anchor.href = window.URL.createObjectURL(blob);
        anchor.click();
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while converting the playlist. Please try again later.');
    }
});
