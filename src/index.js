import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { configureStore, createSlice } from '@reduxjs/toolkit';
import './index.css';

const API_BASE_URL = 'https://api.spacexdata.com/v3';

const missionsSlice = createSlice({
    name: 'missions',
    initialState: [],
    reducers: {
        setMissions: (state, action) => {
            return action.payload;
        },
    },
});

const store = configureStore({
    reducer: {
        missions: missionsSlice.reducer,
    },
});

const App = () => {
    const dispatch = useDispatch();
    const missions = useSelector((state) => state.missions);

    useEffect(() => {
        const fetchMissions = async () => {
            try {
                const response = await fetch(
                    `${API_BASE_URL}/launches?start=2015-01-01T00:00:00Z&end=2019-12-31T23:59:59Z&order=desc&sort=launch_year`
                );
                const data = await response.json();
                dispatch(missionsSlice.actions.setMissions(data));
            } catch (error) {
                console.error('Error fetching missions:', error);
            }
        };

        fetchMissions();
    }, [dispatch]);

    return (
        <div>
            <h1>SpaceX Missions</h1>
            {missions.map((mission) => (
                <div key={mission.flight_number}>
                    <h2>{mission.mission_name}</h2>
                    <p>{mission.details}</p>
                    <p>
                        <strong>Launch Date:</strong> {mission.launch_date_utc}
                    </p>
                    <img src={mission.links.mission_patch_small} alt="Mission Patch" />
                </div>
            ))}
        </div>
    );
};

ReactDOM.createRoot(document.getElementById('root')).render(
    <Provider store={store}>
        <App />
    </Provider>
);
