
import { collection, doc, setDoc, deleteDoc, onSnapshot } from "firebase/firestore";
import { db } from "../lib/firebase";
import { sanitizeData } from "../utils/helpers";
import { LeagueDivisas, Directiva } from "../types";

export const subscribeToLeagues = (
    callback: (data: {
        divisasMap: LeagueDivisas;
        imageMap: Record<string, string>;
        directivasMap: Record<string, Directiva>;
        divImagesMap: Record<string, string>;
        names: string[];
    }) => void,
    onError: (error: any) => void
) => {
    return onSnapshot(collection(db, "leagues"), (snapshot) => {
        const divisasMap: LeagueDivisas = {};
        const imageMap: Record<string, string> = {};
        const directivasMap: Record<string, Directiva> = {};
        const divImagesMap: Record<string, string> = {};
        const names: string[] = [];

        snapshot.docs.forEach(docSnap => {
            const data = sanitizeData(docSnap.data());
            divisasMap[docSnap.id] = data.divisas || [];
            imageMap[docSnap.id] = data.image || '';
            directivasMap[docSnap.id] = data.directiva || null;
            if (data.divisaImages) Object.assign(divImagesMap, data.divisaImages);
            names.push(docSnap.id);
        });

        callback({
            divisasMap,
            imageMap,
            directivasMap,
            divImagesMap,
            names: names.sort()
        });
    }, onError);
};

export const saveLeague = async (leagueName: string, data: any) => {
    const leagueRef = doc(db, "leagues", leagueName);
    await setDoc(leagueRef, sanitizeData(data), { merge: true });
};

export const deleteLeague = async (leagueName: string) => {
    await deleteDoc(doc(db, "leagues", leagueName));
};
