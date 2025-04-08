import axios from "axios";
import delay from "../utils/delay";

let gameMappings: Record<string, string> = {};

const getSteamNameFromId = async (id: string | number): Promise<string | null> => {
    if (gameMappings.hasOwnProperty(id)) {
        return gameMappings[id];
    } else {
        const url = `https://store.steampowered.com/api/appdetails?appids=${id}`;

        const msToWait = 10000 // 10 seconds per retry
        const maxRetries = 60 // 60 retries for 10 minutes
        let attempt = 0

        while (attempt < maxRetries) {
            try {
                const response = await axios.get(url);
                
                if (response.data[id] && response.data[id].data && response.data[id].data.name) {
                    gameMappings[id] = response.data[id].data.name;
                    return response.data[id].data.name;
                } else {
                    throw new Error('Data not found');
                }

            } catch (error) {
                console.error(`Attempt ${attempt + 1} failed: ${(error as Error).message}`);
                
                // Retry after 10 seconds if failed
                attempt++
                if (attempt >= maxRetries) {
                    console.error('Max retries reached. Unable to fetch Steam name.');
                    return null;
                }

                await delay(msToWait)
            }
        }

        return null
    }
}

export default getSteamNameFromId