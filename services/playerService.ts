
import { collection, onSnapshot, doc, setDoc, deleteDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { sanitizeData } from "../utils/helpers";
import { Player } from "../types";

export const subscribeToPlayers = (
    callback: (players: Player[]) => void,
    onError: (error: any) => void
) => {
    return onSnapshot(collection(db, "players"), (snapshot) => {
        callback(snapshot.docs.map(doc => sanitizeData(doc.data()) as Player));
    }, onError);
};

export const savePlayer = async (player: Player) => {
    const playerRef = doc(db, "players", player.id.toString());
    await setDoc(playerRef, sanitizeData(player));
};

export const deletePlayer = async (playerId: number) => {
    await deleteDoc(doc(db, "players", playerId.toString()));
};
