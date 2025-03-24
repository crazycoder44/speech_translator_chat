import json
from channels.generic.websocket import AsyncWebsocketConsumer

class SpeechConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_group_name = "speech_translation"

        # Add user to the WebSocket group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        # Remove user from the WebSocket group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        data = json.loads(text_data)
        message_type = data.get("type")
        text = data.get("text")

        if message_type in ["transcript_message", "translation"]:
            # Broadcast the recognized or translated text to all users
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    "type": "broadcast_message",
                    "message_type": message_type,
                    "text": text
                }
            )

    async def broadcast_message(self, event):
        message_type = event["message_type"]
        text = event["text"]

        # Send the message to all connected clients
        await self.send(text_data=json.dumps({
            "type": message_type,
            "text": text
        }))
