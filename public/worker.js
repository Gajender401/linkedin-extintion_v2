self.onmessage = async function(event) {
    const headers = {
        'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzIzMjYzOTI3LCJpYXQiOjE3MDc0OTU5MjcsImp0aSI6IjcyZDRjZWQzY2RjOTQzODJiNDQyODliMzA3NzAzZjAyIiwidXNlcl9pZCI6ImM1NjY5YTczLWI1NzAtNGI0Yi1hMGI2LWM3ZGVjZDRiY2I1ZiJ9.OUoBVFy9ytZgb6ofJdQuHcjojqXSjIo-wK-OBO2OzTA`, 
        'Content-Type': 'application/json'
      };
    try {
      const response = await fetch('https://bot.kaliper.in/api/api/templates/',{headers});
      const data = await response.json();
      
      // Send the data back to the main thread
      postMessage({ success: true, data });
    } catch (error) {
      // Send the error back to the main thread
      postMessage({ success: false, error: error.message });
    }
  };

  