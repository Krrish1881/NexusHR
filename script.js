document.addEventListener('DOMContentLoaded', function() {
  const candidatesContainer = document.getElementById('candidatesContainer');
  const searchInput = document.getElementById('searchInput');
  const searchBtn = document.getElementById('searchBtn');
  const departmentFilter = document.getElementById('departmentFilter');
  const skillFilter = document.getElementById('skillFilter');
  const experienceFilter = document.getElementById('experienceFilter');
  const totalCandidatesEl = document.getElementById('totalCandidates');
  const avgExperienceEl = document.getElementById('avgExperience');
  const quantumChartCanvas = document.getElementById('quantumChart'); // Corrected ID for the chart canvas
  const aiInsightsEl = document.getElementById('aiInsights'); // Element for AI insights
  const notificationEl = document.getElementById('notification');
  const notificationTitleEl = notificationEl.querySelector('.notification-title');
  const notificationMessageEl = notificationEl.querySelector('.notification-message');
  const notificationCloseBtn = notificationEl.querySelector('.notification-close');
  const loaderEl = document.getElementById('loader');

  let candidatesData = [];
  let skillsChart = null; // Renamed from quantumChart to skillsChart for clarity

  // Function to show notifications
  function showNotification(title, message, type = 'info') {
      notificationTitleEl.textContent = title;
      notificationMessageEl.textContent = message;
      notificationEl.className = `quantum-notification show ${type}`; // Add type for styling
      setTimeout(() => {
          notificationEl.classList.remove('show');
      }, 5000); // Notification disappears after 5 seconds
  }

  // Close notification manually
  notificationCloseBtn.addEventListener('click', () => {
      notificationEl.classList.remove('show');
  });

  // Show loader
  function showLoader() {
      loaderEl.style.opacity = '1';
      loaderEl.style.display = 'flex';
  }

  // Hide loader
  function hideLoader() {
      loaderEl.style.opacity = '0';
      setTimeout(() => {
          loaderEl.style.display = 'none';
      }, 500); // Match CSS transition duration
  }

  // Fetch candidates from backend
  async function fetchCandidates() {
      showLoader();
      candidatesContainer.innerHTML = '<div class="loading">Loading candidates...</div>';
      
      try {
          const response = await fetch('http://localhost:3000/api/candidates');
          if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
          }
          candidatesData = await response.json();
          renderCandidates(candidatesData);
          updateAnalytics();
          initChart();
          showNotification('System Online', 'Talent database synchronized.', 'success');
      } catch (error) {
          console.error('Error fetching candidates:', error);
          candidatesContainer.innerHTML = '<div class="error">Failed to load candidates. Please ensure the backend server is running.</div>';
          showNotification('Error', 'Failed to load talent data.', 'error');
      } finally {
          hideLoader();
      }
  }

  // Render candidates to the DOM
  function renderCandidates(candidates) {
      candidatesContainer.innerHTML = '';
      
      if (candidates.length === 0) {
          candidatesContainer.innerHTML = '<div class="no-results">No candidates found matching your criteria.</div>';
          return;
      }
      
      candidates.forEach(candidate => {
          const candidateCard = document.createElement('div');
          candidateCard.className = 'candidate-card glass-panel';
          
          const departmentClass = candidate.department.toLowerCase().replace(' ', '-');
          
          candidateCard.innerHTML = `
              <div class="candidate-header">
                  <img class="candidate-photo" src="https://placehold.co/200x200?text=${candidate.name.charAt(0)}" alt="Profile photo of ${candidate.name}">
                  <div class="candidate-info">
                      <div class="candidate-name">${candidate.name}</div>
                      <div class="candidate-title">${candidate.title}</div>
                      <span class="candidate-department ${departmentClass}">${candidate.department}</span>
                  </div>
              </div>
              <div class="candidate-description">
                  ${candidate.description || 'No description available.'}
              </div>
              <div class="skills-container">
                  ${candidate.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
              </div>
              <div class="candidate-meta">
                  <span>${candidate.experience} years exp</span>
                  <span>${candidate.location}</span>
              </div>
          `;
          
          candidatesContainer.appendChild(candidateCard);
      });
  }

  // Filter candidates based on search and filters
  function filterCandidates() {
      const searchTerm = searchInput.value.toLowerCase();
      const department = departmentFilter.value;
      const skill = skillFilter.value;
      const experience = experienceFilter.value;

      let filtered = candidatesData.filter(candidate => {
          // Search term matching
          const matchesSearch = 
              candidate.name.toLowerCase().includes(searchTerm) ||
              candidate.title.toLowerCase().includes(searchTerm) ||
              candidate.department.toLowerCase().includes(searchTerm) ||
              (candidate.description && candidate.description.toLowerCase().includes(searchTerm)) || // Check if description exists
              candidate.skills.some(s => s.toLowerCase().includes(searchTerm)) ||
              candidate.location.toLowerCase().includes(searchTerm);

          // Department filter
          const matchesDepartment = department ? candidate.department === department : true;
          
          // Skill filter
          const matchesSkill = skill ? candidate.skills.includes(skill) : true;
          
          // Experience filter
          let matchesExperience = true;
          if (experience) {
              const exp = parseInt(candidate.experience);
              if (experience === '0-2') matchesExperience = exp <= 2;
              else if (experience === '3-5') matchesExperience = exp >= 3 && exp <= 5;
              else if (experience === '5+') matchesExperience = exp >= 5;
          }
          
          return matchesSearch && matchesDepartment && matchesSkill && matchesExperience;
      });

      renderCandidates(filtered);
      updateAnalytics(filtered);
      updateAiInsights(filtered);
  }

  // Update analytics panel
  function updateAnalytics(filteredCandidates = null) {
      const candidates = filteredCandidates || candidatesData;
      totalCandidatesEl.textContent = candidates.length;
      
      if (candidates.length > 0) {
          const totalExp = candidates.reduce((sum, candidate) => sum + parseInt(candidate.experience), 0);
          avgExperienceEl.textContent = (totalExp / candidates.length).toFixed(1);
      } else {
          avgExperienceEl.textContent = '0';
      }
  }

  // Update AI Insights
  function updateAiInsights(filteredCandidates) {
      if (filteredCandidates.length === 0) {
          aiInsightsEl.textContent = 'No talent found. Adjust filters for new insights.';
          return;
      }

      const departments = {};
      const skills = {};
      let totalExperience = 0;

      filteredCandidates.forEach(candidate => {
          departments[candidate.department] = (departments[candidate.department] || 0) + 1;
          candidate.skills.forEach(skill => {
              skills[skill] = (skills[skill] || 0) + 1;
          });
          totalExperience += parseInt(candidate.experience);
      });

      const topDepartment = Object.entries(departments).sort((a, b) => b[1] - a[1])[0];
      const topSkill = Object.entries(skills).sort((a, b) => b[1] - a[1])[0];
      const avgExp = (totalExperience / filteredCandidates.length).toFixed(1);

      let insightText = `Current talent pool: ${filteredCandidates.length} entities. `;
      if (topDepartment) {
          insightText += `Dominant department: ${topDepartment[0]} (${topDepartment[1]} individuals). `;
      }
      if (topSkill) {
          insightText += `Most prevalent skill: ${topSkill[0]} (${topSkill[1]} instances). `;
      }
      insightText += `Average neural index (experience): ${avgExp} years.`;

      aiInsightsEl.textContent = insightText;
  }

  // Initialize skills chart
  function initChart() {
      const ctx = quantumChartCanvas.getContext('2d'); // Use the correct canvas ID
      
      // Count skills frequency
      const skillCounts = {};
      candidatesData.forEach(candidate => {
          candidate.skills.forEach(skill => {
              skillCounts[skill] = (skillCounts[skill] || 0) + 1;
          });
      });
      
      const sortedSkills = Object.entries(skillCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5); // Get top 5 skills
      
      if (skillsChart) {
          skillsChart.destroy(); // Destroy existing chart before creating a new one
      }
      
      skillsChart = new Chart(ctx, {
          type: 'doughnut',
          data: {
              labels: sortedSkills.map(s => s[0]),
              datasets: [{
                  data: sortedSkills.map(s => s[1]),
                  backgroundColor: [
                      'rgba(110, 72, 170, 0.7)', // Neon Purple
                      'rgba(157, 80, 187, 0.7)', // Lighter Purple
                      'rgba(71, 118, 230, 0.7)', // Blue
                      'rgba(230, 115, 71, 0.7)', // Orange
                      'rgba(71, 230, 118, 0.7)'  // Green
                  ],
                  borderColor: [
                      'rgba(255, 255, 255, 0.2)'
                  ],
                  borderWidth: 1
              }]
          },
          options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                  legend: {
                      position: 'right',
                      labels: {
                          color: '#f1f1f1', // Legend text color
                          font: {
                              family: 'Roboto'
                          }
                      }
                  },
                  tooltip: {
                      callbacks: {
                          label: function(context) {
                              let label = context.label || '';
                              if (label) {
                                  label += ': ';
                              }
                              if (context.parsed !== null) {
                                  label += context.parsed;
                              }
                              return label;
                          }
                      }
                  }
              },
              cutout: '70%' // Doughnut hole size
          }
      });
  }

  // Event listeners
  searchBtn.addEventListener('click', filterCandidates);
  searchInput.addEventListener('keyup', function(e) {
      if (e.key === 'Enter') filterCandidates();
  });
  
  departmentFilter.addEventListener('change', filterCandidates);
  skillFilter.addEventListener('change', filterCandidates);
  experienceFilter.addEventListener('change', filterCandidates);

  // View toggle buttons (Grid/List)
  const viewToggleButtons = document.querySelectorAll('.view-toggle');
  viewToggleButtons.forEach(button => {
      button.addEventListener('click', function() {
          viewToggleButtons.forEach(btn => btn.classList.remove('active'));
          this.classList.add('active');
          const view = this.dataset.view;
          if (view === 'grid') {
              candidatesContainer.style.display = 'grid';
              candidatesContainer.style.gridTemplateColumns = 'repeat(auto-fill, minmax(350px, 1fr))';
          } else if (view === 'list') {
              candidatesContainer.style.display = 'flex';
              candidatesContainer.style.flexDirection = 'column';
              candidatesContainer.style.gap = '1rem'; // Adjust gap for list view
          }
      });
  });

  // Initial load
  fetchCandidates();
});
