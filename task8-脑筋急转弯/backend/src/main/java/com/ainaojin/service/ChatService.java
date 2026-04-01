package com.ainaojin.service;

import com.ainaojin.model.ChatRoom;
import java.util.List;

public interface ChatService {
    String doChat(long roomId, String userPrompt);
    List<ChatRoom> getChatRoomList();
}
