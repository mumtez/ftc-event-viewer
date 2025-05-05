import { Team } from '../types';

const API_BASE_URL = 'https://api.ftcscout.org/rest/v1';

export const getEventTeams = async (eventCode: string): Promise<{ eventCode: string; teams: Team[] }> => {
  try {
    console.log('Fetching teams for event code:', eventCode);
    
    // Get teams from event
    const response = await fetch(`${API_BASE_URL}/events/${eventCode}/teams`);

    if (!response.ok) {
      console.error('API Error:', response.status, response.statusText);
      if (response.status === 404) {
        throw new Error('Event not found. Please check the event code.');
      }
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    console.log('API Response:', data);

    if (!data || !Array.isArray(data)) {
      console.error('Invalid response format:', data);
      throw new Error('Invalid response format from API');
    }

    // Get team details and OPR for each team
    const teams = await Promise.all(data.map(async (team: any) => {
      const teamNumber = team.teamNumber || team.number || 'Unknown';
      
      try {
        // Get team details
        const teamResponse = await fetch(`${API_BASE_URL}/teams/${teamNumber}`);
        const teamData = await teamResponse.json();
        
        // Get team OPR
        const statsResponse = await fetch(`${API_BASE_URL}/teams/${teamNumber}/quick-stats`);
        const statsData = await statsResponse.json();
        
        return {
          number: teamNumber,
          name: teamData.name || `Team ${teamNumber}`,
          opr: statsData.tot?.value || 0,
          worldRank: statsData.tot?.rank || undefined,
          schoolName: teamData.schoolName,
          country: teamData.country,
          state: teamData.state,
          city: teamData.city,
          rookieYear: teamData.rookieYear,
          website: teamData.website
        };
      } catch (error) {
        console.error(`Error fetching details for team ${teamNumber}:`, error);
        return {
          number: teamNumber,
          name: `Team ${teamNumber}`,
          opr: 0
        };
      }
    }));

    if (teams.length === 0) {
      throw new Error('No teams found for this event');
    }

    const sortedTeams = teams.sort((a: Team, b: Team) => b.opr - a.opr);
    return { eventCode, teams: sortedTeams };
  } catch (error) {
    console.error('Error fetching event teams:', error);
    throw error;
  }
}; 