import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { Client, StompSubscription } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

interface StompContextType {
  client: Client | null;
  connected: boolean;
  subscribe: <T = unknown>(destination: string, callback: (body: T) => void) => void;
  unsubscribe: (destination: string) => void;
  unsubscribeAll: () => void;
  publish: <T = unknown>(destination: string, body?: T) => void;
}

const StompContext = createContext<StompContextType | null>(null);

export const StompProvider = ({ children }: { children: React.ReactNode }) => {
  const [connected, setConnected] = useState(false);
  const subscriptions = useRef<Map<string, StompSubscription>>(new Map());

  const socket = new SockJS(import.meta.env.VITE_WEBSOCKET_URL);
  const clientRef = useRef<Client>(
    new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      onConnect: () => {
        setConnected(true);
        console.log('STOMP 연결됨');
      },
      onDisconnect: () => {
        setConnected(false);
      },
      onStompError: (frame) => {
        console.error('STOMP 오류:', frame);
      },
    })
  );

  const subscribe = <T = unknown,>(destination: string, callback: (body: T) => void) => {
    if (!clientRef.current.connected) return;

    // if (subscriptions.current.has(destination)) {
    //   console.warn(`이미 구독 중: ${destination}`);
    //   return;
    // }

    const sub = clientRef.current.subscribe(destination, (message) => {
      const data = JSON.parse(message.body) as T;
      callback(data);
    });

    subscriptions.current.set(destination, sub);
    console.log(`구독됨: ${destination}`);
  };

  const unsubscribe = (destination: string) => {
    const sub = subscriptions.current.get(destination);
    if (sub) {
      sub.unsubscribe();
      subscriptions.current.delete(destination);
      console.log(`구독 해제됨: ${destination}`);
    }
  };

  const unsubscribeAll = () => {
    subscriptions.current.forEach((sub) => sub.unsubscribe());
    subscriptions.current.clear();
    console.log('모든 구독 해제됨');
  };

  const publish = <T = unknown,>(destination: string, body: T) => {
    if (!clientRef.current.connected) {
      console.warn('STOMP 연결되지 않음. 메시지 전송 실패');
      return;
    }

    clientRef.current.publish({
      destination,
      body: JSON.stringify(body),
    });

    console.log(`메시지 전송됨 → ${destination}`);
  };

  useEffect(() => {
    clientRef.current.activate();
    return () => {
      clientRef.current.deactivate();
      subscriptions.current.forEach((sub) => sub.unsubscribe());
      subscriptions.current.clear();
    };
  }, []);

  return (
    <StompContext.Provider
      value={{
        client: clientRef.current,
        connected,
        subscribe,
        unsubscribe,
        unsubscribeAll,
        publish,
      }}
    >
      {children}
    </StompContext.Provider>
  );
};

export const useStompClient = () => {
  const client = useContext(StompContext);
  if (!client) throw new Error('StompClient를 찾을 수 없습니다.');
  return client;
};
