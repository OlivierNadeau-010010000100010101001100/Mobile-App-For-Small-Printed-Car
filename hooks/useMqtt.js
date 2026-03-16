import { useEffect, useRef } from 'react';
import mqtt from 'mqtt';
import useRcStore from '../store/useRcStore';

const BROKER_URL = 'ws://172.16.206.22:9001';
const TOPIC      = 'rc/control';

export default function useMqtt() {
  const clientRef = useRef(null);
  const { setConnected, setSend } = useRcStore();

  useEffect(() => {
    const client = mqtt.connect(BROKER_URL);
    clientRef.current = client;

    client.on('connect', () => setConnected(true));
    client.on('close',   () => setConnected(false));

    setSend((cmd) => client.publish(TOPIC, cmd));

    return () => client.end();
  }, []);
}