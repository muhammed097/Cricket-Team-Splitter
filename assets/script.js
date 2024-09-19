    let players = [];
    let teams = [];

    function initializeTeams() {
        teams = [
            { name: 'Team 1', players: [] },
            { name: 'Team 2', players: [] }
        ];
        renderTeams();
    }

    initializeTeams();

    function addPlayer() {
        let name = document.getElementById('playerName').value.trim();
        let role = document.getElementById('playerRole').value;
        if (name === '') {
            alert('Please enter a player name.');
            return;
        }
        players.push({ name: name, role: role });
        updatePlayerList();
        document.getElementById('playerName').value = '';
        splitTeams(); // Automatically split teams after adding a player
    }

    function updatePlayerList() {
        let list = document.getElementById('playerList');
        list.innerHTML = '';
        players.forEach((player, index) => {
            let item = document.createElement('li');

            let playerInfo = document.createElement('span');
            playerInfo.textContent = `${player.name} (${player.role})`;

            // Create a container for the buttons
            let buttonContainer = document.createElement('span');
            buttonContainer.className = 'button-container';

            let editBtn = document.createElement('span');
            editBtn.innerHTML = '&#9998;'; // Pencil icon
            editBtn.className = 'edit-button';
            editBtn.onclick = function() {
                editPlayer(index);
            };

            let removeBtn = document.createElement('span');
            removeBtn.innerHTML = '&times;';
            removeBtn.className = 'remove-button';
            removeBtn.onclick = function() {
                removePlayer(index);
            };

            buttonContainer.appendChild(editBtn);
            buttonContainer.appendChild(removeBtn);

            item.appendChild(playerInfo);
            item.appendChild(buttonContainer);
            list.appendChild(item);
        });
    }

    function editPlayer(index) {
        let player = players[index];
        let newName = prompt("Enter new name for " + player.name, player.name);
        if (newName !== null && newName.trim() !== "") {
            player.name = newName.trim();
            updatePlayerList();
            splitTeams(); // Automatically split teams after editing a player
        }
    }

    function removePlayer(index) {
        players.splice(index, 1);
        updatePlayerList();
        splitTeams(); // Automatically split teams after removing a player
    }

    function shuffleArray(array) {
        // Fisher-Yates shuffle algorithm
        for (let i = array.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function splitTeams() {
        // Clear existing players in teams
        teams.forEach(team => team.players = []);

        if (players.length === 0) {
            renderTeams();
            return;
        }

        // Separate players by roles
        let roles = ['Batter', 'Bowler', 'All-Rounder', 'Wicket Keeper'];
        let roleGroups = {};
        roles.forEach(role => {
            roleGroups[role] = players.filter(p => p.role === role);
            shuffleArray(roleGroups[role]);
        });

        // Function to distribute players equally according to their roles
        function distributePlayersEqually(roleGroup) {
            let totalPlayers = roleGroup.length;
            let baseCount = Math.floor(totalPlayers / teams.length);
            let extra = totalPlayers % teams.length;

            // Determine the desired number of players per team for this role
            let desiredCounts = teams.map((_, i) => baseCount + (i < extra ? 1 : 0));

            // Distribute players
            let index = 0;
            teams.forEach((team, i) => {
                for (let j = 0; j < desiredCounts[i]; j++) {
                    if (index < roleGroup.length) {
                        team.players.push(roleGroup[index]);
                        index++;
                    }
                }
            });
        }

        // Distribute players for each role
        roles.forEach(role => {
            distributePlayersEqually(roleGroups[role]);
        });

        // Display teams
        renderTeams();

        // Show or hide the Download PDF button
        if (players.length > 0) {
            document.getElementById('downloadSection').style.display = 'block';
        } else {
            document.getElementById('downloadSection').style.display = 'none';
        }
    }

    function renderTeams() {
        let teamsSection = document.getElementById('teamsSection');
        teamsSection.innerHTML = '';
        teams.forEach((team, index) => {
            let teamContainer = document.createElement('div');
            teamContainer.className = 'team-container';

            let teamHeader = document.createElement('h2');
            teamHeader.textContent = team.name;
            teamContainer.appendChild(teamHeader);

            let teamList = document.createElement('ul');
            teamList.className = 'team';
            team.players.forEach(player => {
                let item = document.createElement('li');
                item.textContent = `${player.name} (${player.role})`;
                teamList.appendChild(item);
            });
            teamContainer.appendChild(teamList);
            teamsSection.appendChild(teamContainer);
        });
    }

    function addTeam() {
        let newTeamNumber = teams.length + 1;
        teams.push({ name: `Team ${newTeamNumber}`, players: [] });
        renderTeams();
        splitTeams(); // Automatically split teams after adding a new team
    }

    function resetTeams() {
        // Clear the players array
        players = [];
        // Reset teams to two default teams
        initializeTeams();
        // Clear the player list
        document.getElementById('playerList').innerHTML = '';
        // Hide the Download PDF button
        document.getElementById('downloadSection').style.display = 'none';
    }

    function downloadPDF() {
        // Create a new jsPDF instance
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // Add title
        doc.setFontSize(18);
        doc.text('Cricket Team Splitter', 105, 20, null, null, 'center');

        let startY = 30;
        teams.forEach((team, index) => {
            if (startY > 270) {
                doc.addPage();
                startY = 20;
            }
            doc.setFontSize(16);
            doc.text(team.name, 20, startY);
            doc.setFontSize(12);
            startY += 10;
            team.players.forEach(player => {
                if (startY > 280) {
                    doc.addPage();
                    startY = 20;
                }
                doc.text(`${player.name} (${player.role})`, 20, startY);
                startY += 10;
            });
            startY += 10; // Add extra space after each team
        });

        // Save the PDF
        doc.save('Cricket_Teams.pdf');
    }

    // Handle Dark Mode Toggle
    document.getElementById('darkModeToggle').addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
    });
