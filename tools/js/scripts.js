document.addEventListener("DOMContentLoaded", () => {
    const podcasts = [
      { id: 1, title: "Tech Talks", created: "2023-01-01", listens: 1500, image: "https://via.placeholder.com/300x180?text=Tech+Talks" },
      { id: 2, title: "Health Tips", created: "2023-02-15", listens: 1200, image: "https://via.placeholder.com/300x180?text=Health+Tips" }
    ];
  
    const episodes = {
      1: [
        { id: 101, title: "AI Trends", description: "Discussing AI trends", date: "2023-03-01", listens: 500, audio: "", image: "https://via.placeholder.com/150?text=AI" },
        { id: 102, title: "Cybersecurity", description: "Cybersecurity trends", date: "2023-03-05", listens: 400, audio: "", image: "https://via.placeholder.com/150?text=Cybersecurity" }
      ],
      2: [
        { id: 201, title: "Dieting Myths", description: "Discussing dieting myths", date: "2023-03-10", listens: 700, audio: "", image: "https://via.placeholder.com/150?text=Dieting+Myths" }
      ]
    };
  
    const podcastList = document.getElementById("podcast-list");
    const episodeList = document.getElementById("episode-list");
    const addPodcastBtn = document.getElementById("add-podcast-btn");
    const addPodcastForm = document.getElementById("add-podcast-form");
    const cancelAddPodcastBtn = document.getElementById("cancel-add-podcast");
    const addPodcastSection = document.getElementById("add-podcast-section");
  
    const addEpisodeBtn = document.getElementById("add-episode-btn");
    const addEpisodeForm = document.getElementById("add-episode-form");
    const cancelAddEpisodeBtn = document.getElementById("cancel-add-episode");
    const addEpisodeSection = document.getElementById("add-episode-section");
  
    const statsChart = document.getElementById("stats-chart").getContext("2d");
  
    let selectedPodcastId = null;
  
    // Render Podcasts
    const renderPodcasts = () => {
      podcastList.innerHTML = podcasts.map(podcast => `
        <div class="col-md-4 col-sm-6">
            <div class="card">
            <img src="${podcast.image}" alt="${podcast.title} Cover">
            <h3 class="card_head">${podcast.title}</h3>
            <p>Created: ${podcast.created}</p>
            <p>Listens: ${podcast.listens}</p>
            <button class="material-button w-100" onclick="viewEpisodes(${podcast.id})">Manage Episodes</button>
            </div>
        </div>
      `).join("");
    };
  
    // Render Episodes
    const renderEpisodes = () => {
      const currentEpisodes = episodes[selectedPodcastId] || [];
      episodeList.innerHTML = currentEpisodes.map(episode => `
        <div class="col-md-4 col-sm-6">
            <div class="card">
            <img src="${episode.image}" alt="${episode.title} Cover">
            <h3 class="card_head">${episode.title}</h3>
            <p>Listens: ${episode.listens}</p>
            <p>${episode.description}</p>
            <p>Publish Date: ${episode.date}</p>
            </div>
        </div>
      `).join("");
    };
  
    // Add Podcast
    addPodcastBtn.addEventListener("click", () => {
      document.getElementById("podcast-section").style.display = "none";
      addPodcastSection.style.display = "block";
    });
  
    // Cancel Add Podcast
    cancelAddPodcastBtn.addEventListener("click", () => {
      addPodcastSection.style.display = "none";
      document.getElementById("podcast-section").style.display = "block";
    });
  
    // Handle Add Podcast Form Submission
    addPodcastForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const title = document.getElementById("podcast-title").value;
      const created = document.getElementById("podcast-created").value;
      const listens = document.getElementById("podcast-listens").value;
  
      const newPodcast = {
        id: Date.now(),
        title,
        created,
        listens: parseInt(listens),
        image: "https://via.placeholder.com/300x180?text=New+Podcast"
      };
  
      podcasts.push(newPodcast);
  
      // Reset the form and hide the add section
      addPodcastForm.reset();
      addPodcastSection.style.display = "none";
      document.getElementById("podcast-section").style.display = "block";
  
      renderPodcasts();
    });
  
    // Add Episode
    addEpisodeBtn.addEventListener("click", () => {
      addEpisodeSection.style.display = "block";
      document.getElementById("episode-section").style.display = "none";
    });
  
    // Cancel Add Episode
    cancelAddEpisodeBtn.addEventListener("click", () => {
      addEpisodeSection.style.display = "none";
      document.getElementById("episode-section").style.display = "block";
    });
  
    // Handle Add Episode Form Submission
    addEpisodeForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const title = document.getElementById("episode-title").value;
      const description = document.getElementById("episode-description").value;
      const date = document.getElementById("episode-date").value;
      const audio = document.getElementById("episode-audio").files[0];
  
      const newEpisode = {
        id: Date.now(),
        title,
        description,
        date,
        listens: 0,
        audio: audio ? URL.createObjectURL(audio) : null,
        image: "https://via.placeholder.com/150?text=New+Episode"
      };
  
      if (episodes[selectedPodcastId]) {
        episodes[selectedPodcastId].push(newEpisode);
      } else {
        episodes[selectedPodcastId] = [newEpisode];
      }
  
      // Reset the form and hide the add section
      addEpisodeForm.reset();
      addEpisodeSection.style.display = "none";
      document.getElementById("episode-section").style.display = "block";
  
      renderEpisodes();
    });
  
    // View Episodes
    window.viewEpisodes = (podcastId) => {
      selectedPodcastId = podcastId;
      document.getElementById("selected-podcast-title").textContent = podcasts.find(p => p.id === podcastId).title;
      document.getElementById("podcast-section").style.display = "none";
      document.getElementById("episode-section").style.display = "block";
      renderEpisodes();
    };
  
    // Back to Podcasts
    document.getElementById("back-to-podcasts").addEventListener("click", () => {
      document.getElementById("podcast-section").style.display = "block";
      document.getElementById("episode-section").style.display = "none";
    });
  
    // Initialize Chart.js for Stats Visualization
    const chart = new Chart(statsChart, {
      type: 'bar',
      data: {
        labels: podcasts.map(p => p.title),
        datasets: [{
          label: 'Total Listens',
          data: podcasts.map(p => p.listens),
          backgroundColor: '#007bff',
          borderRadius: 4,
          borderColor: '#007bff',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
        },
        scales: {
          x: {
            beginAtZero: true
          }
        }
      }
    });
  
    renderPodcasts();
  });
  