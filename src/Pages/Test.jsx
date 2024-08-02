import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Select from 'react-select';

const DecisionForm = () => {
    const [decisions, setDecisions] = useState([]);
    const [selectedDecisions, setSelectedDecisions] = useState({
        decision1: null,
        decision2: null,
        decision3: null
    });
    const userId = 3;  // ID de l'utilisateur à mettre à jour
    const token = localStorage.getItem('token');  // Remplacez par le token réel

    useEffect(() => {
        const fetchDecisions = async () => {
            try {
                // Fetch all decisions from WordPress
                const response = await axios.get('https://alt.back.qilinsa.com/wp-json/wp/v2/decisions');
                const options = response.data.map(decision => ({
                    value: decision.id,
                    label: decision.title.rendered
                }));
                setDecisions(options);

                // Fetch user data from WordPress
                const userResponse = await axios.get(`https://alt.back.qilinsa.com/wp-json/wp/v2/users/${userId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const user = userResponse.data;
                setSelectedDecisions({
                    decision1: options.find(option => option.value === user.acf.decision1) || null,
                    decision2: options.find(option => option.value === user.acf.decision2) || null,
                    decision3: options.find(option => option.value === user.acf.decision3) || null
                });
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchDecisions();
    }, [token, userId]);

    const handleSelectChange = (selectedOption, { name }) => {
        setSelectedDecisions({
            ...selectedDecisions,
            [name]: selectedOption
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const updatedData = {
            acf: {
                decision1: selectedDecisions.decision1 ? selectedDecisions.decision1.value : null,
                decision2: selectedDecisions.decision2 ? selectedDecisions.decision2.value : null,
                decision3: selectedDecisions.decision3 ? selectedDecisions.decision3.value : null,
            }
        };

        try {
            const response = await axios.put(`https://alt.back.qilinsa.com/wp-json/wp/v2/users/${userId}`, updatedData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            console.log('User updated:', response.data);
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Decision 1:
                <Select
                    name="decision1"
                    value={selectedDecisions.decision1}
                    onChange={handleSelectChange}
                    options={decisions}
                    placeholder="Select a decision"
                    isSearchable
                />
            </label>
            <br />
            <label>
                Decision 2:
                <Select
                    name="decision2"
                    value={selectedDecisions.decision2}
                    onChange={handleSelectChange}
                    options={decisions}
                    placeholder="Select a decision"
                    isSearchable
                />
            </label>
            <br />
            <label>
                Decision 3:
                <Select
                    name="decision3"
                    value={selectedDecisions.decision3}
                    onChange={handleSelectChange}
                    options={decisions}
                    placeholder="Select a decision"
                    isSearchable
                />
            </label>
            <br />
            <button type="submit">Submit</button>
        </form>
    );
};

export default DecisionForm;
