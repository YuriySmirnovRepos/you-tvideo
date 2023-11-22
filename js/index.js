const API_KEY = 'AIzaSyCrYNj-NCulkqDogzOtMsi6wOOBlWF4qdk';
const VIDEOS_URL = 'https://www.googleapis.com/youtube/v3/videos'
const SEARCH_URL = 'https://www.googleapis.com/youtube/v3/search'

const videoListItems = document.querySelector('.video-list__items');

const fetchTrendingVideos = async () => {
    try {
        const url = new URL(VIDEOS_URL);
        url.searchParams.append('part', 'contentDetails,id,snippet');
        url.searchParams.append('chart', 'mostPopular');
        url.searchParams.append('regionCode', 'RU');
        url.searchParams.append('key', API_KEY);
        url.searchParams.append('maxResults', 12);

        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.log('error:', error);
    }
    return null;
}
const displayVideo = (videos) =>
{
    const listVideos = videos.items.map(video => {
        const li = document.createElement('li');
        li.classList.add('video-list__item');
        li.innerHTML = ` <article class="video-card">
            <a href="video.html" class="video-card__link">
                <img src="./image/image1.jpg" 
                alt="Философия идущего к реке" 
                class="video-card__thumbnail">
                <h3 class="video-card__title">Философия идущего к реке</h3>
                <p class= "video-card__channel">Правое полушарие интроверта</p>
                <p class= "video-card__duration">
                    31 мин 25 сек
                </p>
            </a>
            <button class="video-card__favorite" type="button" 
            aria-label="Добавить в избранное, Философия идущего к реке">
                <svg class="video-card__icon">
                    <use class="star-o" xlink:href="image/sprite.svg#star-ob"></use>
                    <use class="star" xlink:href="image/sprite.svg#star"></use>
                </svg>
            </button>
        </article>`;
        return li;
    });

    videoListItems.append(...listVideos);
}

fetchTrendingVideos().then(displayVideo)