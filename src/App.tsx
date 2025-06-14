import React, { useState, useEffect, ChangeEvent } from 'react';
import { Container, Typography, TextField, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress, Box, AppBar, Toolbar, Card, CardContent, Link } from '@mui/material';
import { getEventTeams } from './services/ftcApi';
import { Event, Team } from './types';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

type SortField = 'number' | 'name' | 'opr';
type SortDirection = 'asc' | 'desc';

function App() {
  const [eventCode, setEventCode] = useState('');
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sortField, setSortField] = useState<SortField>('opr');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);

  useEffect(() => {
    const fetchEventData = async () => {
      if (!eventCode) {
        setEvent(null);
        return;
      }
      
      setLoading(true);
      setError(null);
      try {
        const eventData = await getEventTeams(eventCode);
        if (eventData.teams.length === 0) {
          setError('No teams found for this event. Please check the event code.');
          setEvent(null);
        } else {
          setEvent(eventData);
        }
      } catch (err: any) {
        console.error('Error in fetchEventData:', err);
        let errorMessage = 'Failed to fetch event data. Please check the event code and try again.';
        if (err.response?.status === 404) {
          errorMessage = 'Event not found. Please check the event code.';
        } else if (err.response?.data) {
          errorMessage = `Error: ${err.response.data}`;
        }
        setError(errorMessage);
        setEvent(null);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchEventData, 500);
    return () => clearTimeout(debounceTimer);
  }, [eventCode]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedTeams = event?.teams ? [...event.teams].sort((a, b) => {
    const direction = sortDirection === 'asc' ? 1 : -1;
    if (sortField === 'number') {
      return direction * (parseInt(a.number) - parseInt(b.number));
    } else if (sortField === 'name') {
      return direction * a.name.localeCompare(b.name);
    } else {
      return direction * (a.opr - b.opr);
    }
  }) : [];

  const TeamDetailsCard = ({ team }: { team: Team }) => (
    <Card sx={{ 
      boxShadow: 'none', 
      border: '1px solid #d2d2d7', 
      borderRadius: 0,
      flex: 1,
      height: 'fit-content'
    }}>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ color: '#1d1d1f', fontWeight: 500 }}>
          Team {team.number}
        </Typography>
        <Typography variant="subtitle1" sx={{ color: '#1d1d1f', mb: 2 }}>
          {team.name}
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box>
            <Typography variant="body2" sx={{ color: '#86868b' }}>OPR</Typography>
            <Typography variant="h5" sx={{ color: '#1d1d1f' }}>{team.opr.toFixed(2)}</Typography>
          </Box>

          {team.worldRank && (
            <Box>
              <Typography variant="body2" sx={{ color: '#86868b' }}>World Ranking</Typography>
              <Typography variant="body1" sx={{ color: '#1d1d1f' }}>#{team.worldRank}</Typography>
            </Box>
          )}

          {team.schoolName && (
            <Box>
              <Typography variant="body2" sx={{ color: '#86868b' }}>School</Typography>
              <Typography variant="body1" sx={{ color: '#1d1d1f' }}>{team.schoolName}</Typography>
            </Box>
          )}

          {(team.city || team.state || team.country) && (
            <Box>
              <Typography variant="body2" sx={{ color: '#86868b' }}>Location</Typography>
              <Typography variant="body1" sx={{ color: '#1d1d1f' }}>
                {[team.city, team.state, team.country].filter(Boolean).join(', ')}
              </Typography>
            </Box>
          )}

          {team.rookieYear && (
            <Box>
              <Typography variant="body2" sx={{ color: '#86868b' }}>Rookie Year</Typography>
              <Typography variant="body1" sx={{ color: '#1d1d1f' }}>{team.rookieYear}</Typography>
            </Box>
          )}

          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Link
              href={`https://ftcscout.org/teams/${team.number}`}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                color: '#0071e3',
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline',
                },
              }}
            >
              View on FTCScout
              <OpenInNewIcon fontSize="small" />
            </Link>
            <Link
              href={`https://theorangealliance.org/teams/${team.number}`}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                color: '#ff6b00',
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline',
                },
              }}
            >
              View on Orange Alliance
              <OpenInNewIcon fontSize="small" />
            </Link>
            {team.website && (
              <Link
                href={team.website}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  color: '#0071e3',
                  textDecoration: 'none',
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
                Team Website
                <OpenInNewIcon fontSize="small" />
              </Link>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <>
      <AppBar position="static" color="default" elevation={0} sx={{ backgroundColor: '#f5f5f7', borderBottom: '1px solid #d2d2d7' }}>
        <Toolbar>
          <Box
            component="img"
            src="https://upload.wikimedia.org/wikipedia/en/thumb/a/a2/FIRST_Logo.svg/1200px-FIRST_Logo.svg.png"
            alt="FIRST Logo"
            sx={{ height: 40, mr: 2 }}
          />
          <Typography variant="h6" component="div" sx={{ 
            flexGrow: 1, 
            color: '#1d1d1f',
            fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif',
            fontWeight: 500,
            letterSpacing: '-0.02em'
          }}>
            FTC Event Viewer
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Card sx={{ boxShadow: 'none', border: '1px solid #d2d2d7', borderRadius: 0 }}>
            <CardContent sx={{ p: 3 }}>
              <TextField
                variant="outlined"
                label="Event Code"
                value={eventCode}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setEventCode(e.target.value)}
                placeholder="Enter event code (e.g., 2024/USCHSLAOS)"
                fullWidth
                sx={{ 
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 0,
                    '&:hover fieldset': {
                      borderColor: '#0071e3',
                    },
                  },
                }}
              />
            </CardContent>
          </Card>

          {error && (
            <Typography color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}

          <Box sx={{ display: 'flex', gap: 3 }}>
            <TableContainer component={Paper} sx={{ 
              boxShadow: 'none', 
              border: '1px solid #d2d2d7', 
              borderRadius: 0,
              flex: 2
            }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell 
                      component="th"
                      onClick={() => handleSort('number')}
                      sx={{ 
                        cursor: 'pointer',
                        color: '#1d1d1f',
                        fontWeight: 500,
                        '&:hover': { backgroundColor: '#f5f5f7' }
                      }}
                    >
                      Team Number
                      {sortField === 'number' && (
                        sortDirection === 'asc' ? <ArrowUpwardIcon fontSize="small" /> : <ArrowDownwardIcon fontSize="small" />
                      )}
                    </TableCell>
                    <TableCell 
                      component="th"
                      onClick={() => handleSort('name')}
                      sx={{ 
                        cursor: 'pointer',
                        color: '#1d1d1f',
                        fontWeight: 500,
                        '&:hover': { backgroundColor: '#f5f5f7' }
                      }}
                    >
                      Team Name
                      {sortField === 'name' && (
                        sortDirection === 'asc' ? <ArrowUpwardIcon fontSize="small" /> : <ArrowDownwardIcon fontSize="small" />
                      )}
                    </TableCell>
                    <TableCell 
                      component="th"
                      align="right"
                      onClick={() => handleSort('opr')}
                      sx={{ 
                        cursor: 'pointer',
                        color: '#1d1d1f',
                        fontWeight: 500,
                        '&:hover': { backgroundColor: '#f5f5f7' }
                      }}
                    >
                      OPR
                      {sortField === 'opr' && (
                        sortDirection === 'asc' ? <ArrowUpwardIcon fontSize="small" /> : <ArrowDownwardIcon fontSize="small" />
                      )}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={3} align="center" sx={{ py: 4 }}>
                        <CircularProgress size={24} />
                      </TableCell>
                    </TableRow>
                  ) : event?.teams ? sortedTeams.map((team: Team) => (
                    <TableRow 
                      key={team.number} 
                      hover 
                      onClick={() => setSelectedTeam(selectedTeam?.number === team.number ? null : team)}
                      sx={{ 
                        '&:hover': { backgroundColor: '#f5f5f7', cursor: 'pointer' },
                        backgroundColor: selectedTeam?.number === team.number ? '#f5f5f7' : 'inherit'
                      }}
                    >
                      <TableCell sx={{ color: '#1d1d1f' }}>{team.number}</TableCell>
                      <TableCell sx={{ color: '#1d1d1f' }}>{team.name}</TableCell>
                      <TableCell align="right" sx={{ color: '#1d1d1f' }}>{team.opr.toFixed(2)}</TableCell>
                    </TableRow>
                  )) : (
                    <TableRow>
                      <TableCell colSpan={3} align="center" sx={{ color: '#86868b' }}>
                        Enter an event code to view teams
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            {selectedTeam && (
              <TeamDetailsCard team={selectedTeam} />
            )}
          </Box>
        </Box>
      </Container>
    </>
  );
}

export default App; 