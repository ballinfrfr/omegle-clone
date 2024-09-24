const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 3030 });

let clients = []; // Keep track of connected clients

wss.on('connection', (ws) => {
    // Add the new client to the pool of clients
    clients.push(ws);

    // Try to pair the user with another available client
    pairUsers();

    // Handle incoming messages
    ws.on('message', (message) => {
        // If the user has a partner, forward the message to the partner
        if (ws.partner && ws.partner.readyState === WebSocket.OPEN) {
            ws.partner.send(message.toString()); // Ensure the message is sent as a string
        }
    });

    // Handle disconnection
    ws.on('close', () => {
        // Remove the client from the list
        clients = clients.filter(client => client !== ws);

        // Notify the partner that the user has disconnected
        if (ws.partner && ws.partner.readyState === WebSocket.OPEN) {
            ws.partner.send('Your partner has disconnected.');
            ws.partner.partner = null; // Unpair the partner
        }

        // Try to re-pair remaining clients
        pairUsers();
    });
});

// Function to pair users together
function pairUsers() {
    let availableClients = clients.filter(client => !client.partner); // Clients without partners

    while (availableClients.length >= 2) {
        const client1 = availableClients.pop(); // Take one client
        const client2 = availableClients.pop(); // Take another client

        // Pair them together
        client1.partner = client2;
        client2.partner = client1;

        // Notify both users that they've been paired
        client1.send('You are now connected to a new partner!');
        client2.send('You are now connected to a new partner!');
    }
}

console.log('WebSocket server running on ws://localhost:3030');
