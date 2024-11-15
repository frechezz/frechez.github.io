class DataLoader {
    static async loadData(fileName) {
        try {
            console.log(`Loading data from: data/${fileName}.json`);
            const response = await fetch(`data/${fileName}.json`);
            const data = await response.json();
            console.log('Loaded data:', data);
            return data;
        } catch (error) {
            console.error('Error loading data:', error);
            return null;
        }
    }

    static renderMovies(data) {
        const container = document.querySelector('.movies-showcase');
        container.innerHTML = data.movies.map(movie => `
            <article class="movie-card" data-genre="${movie.genre}">
                <div class="movie-poster">
                    <img src="images/movies/${movie.image}" alt="${movie.title}">
                    <div class="movie-overlay">
                        ${movie.trailer ? 
                            `<a href="#" class="btn-watch" data-trailer="${movie.trailer}">
                                <i class="fas fa-play"></i> Watch Trailer
                            </a>` : 
                            ''
                        }
                    </div>
                </div>
                <div class="movie-info">
                    <h3>${movie.title}</h3>
                    <div class="movie-meta">
                        <span>${movie.year}</span>
                        <span class="genre">${movie.genre}</span>
                    </div>
                    <p>${movie.description}</p>
                    <div class="rating">
                        ${this.generateRatingStars(movie.rating)}
                    </div>
                </div>
            </article>
        `).join('');

        this.initTrailerButtons();
    }

    static initTrailerButtons() {
        const trailerButtons = document.querySelectorAll('.btn-watch');
        trailerButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const trailerUrl = button.getAttribute('data-trailer');
                if (trailerUrl) {
                    this.openTrailer(trailerUrl);
                }
            });
        });
    }

    static openTrailer(url) {
        const modal = document.createElement('div');
        modal.className = 'trailer-modal';
        
        const videoId = this.getYoutubeVideoId(url);
        
        modal.innerHTML = `
            <div class="trailer-modal-content">
                <button class="close-modal">&times;</button>
                <iframe 
                    width="960" 
                    height="540" 
                    src="https://www.youtube.com/embed/${videoId}?autoplay=1" 
                    frameborder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowfullscreen>
                </iframe>
            </div>
        `;

        document.body.appendChild(modal);

        const closeButton = modal.querySelector('.close-modal');
        closeButton.addEventListener('click', () => {
            document.body.removeChild(modal);
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
    }

    static getYoutubeVideoId(url) {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    }

    static renderTimeline(data) {
        const container = document.querySelector('.timeline');
        container.innerHTML = data.timeline.map(item => `
            <div class="timeline-item">
                <div class="timeline-dot"></div>
                <div class="timeline-content">
                    <div class="timeline-header">
                        <div class="timeline-date">${item.date}</div>
                        <img src="images/${item.logo}" alt="${item.title}" class="timeline-logo">
                        <h3>${item.title}</h3>
                    </div>
                    <p>${item.description}</p>
                    ${item.images ? this.renderGallery(item.images) : ''}
                </div>
            </div>
        `).join('');
    }

    static renderProjects(data) {
        const container = document.querySelector('.projects-showcase');
        container.innerHTML = data.projects.map(project => `
            <article class="project-card">
                <div class="project-image">
                    <img src="images/projects/${project.image}" alt="${project.title}">
                </div>
                <div class="project-content">
                    <h3>${project.title}</h3>
                    <p>${project.description}</p>
                    <div class="tech-stack">
                        ${project.technologies.map(tech => `<span>${tech}</span>`).join('')}
                    </div>
                    <a href="${project.link}" class="btn" target="_blank">View Project</a>
                </div>
            </article>
        `).join('');
    }

    static generateRatingStars(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        let stars = '';
        
        for (let i = 0; i < fullStars; i++) {
            stars += '<i class="fas fa-star"></i>';
        }
        if (hasHalfStar) {
            stars += '<i class="fas fa-star-half"></i>';
        }
        return stars;
    }

    static renderGallery(images) {
        if (!images || images.length === 0) return '';
        return `
            <div class="timeline-gallery">
                ${images.map(img => `
                    <img src="images/timeline/${img}" alt="Gallery image">
                `).join('')}
            </div>
        `;
    }
} 