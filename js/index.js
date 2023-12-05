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
            <a href="video.html?id=${video.id}" class="video-card__link">
                <img src="${video.snippet.thumbnails.standart?.url ||
                video.snippet.thumbnails.high?.url}" 
                alt="Превью видео ${video.snippet.title}" 
                class="video-card__thumbnail">
                <h3 class="video-card__title">${video.snippet.title}</h3>
                <p class= "video-card__channel">${video.snippet.channelTitle}</p>
                <p class= "video-card__duration">
                    ${video.contentDetails.duration}
                </p>
            </a>
            <button class="video-card__favorite" type="button" 
            aria-label="Добавить в избранное, ${video.snippet.title}">
                <svg class="video-card__icon">
                    <use class="star-o" xlink:href="image/sprite.svg#star-ow"></use>
                    <use class="star" xlink:href="image/sprite.svg#star"></use>
                </svg>
            </button>
        </article>`;
        console.log(video.contentDetails.duration);
        return li;
    });

    videoListItems.append(...listVideos);
}

fetchTrendingVideos().then(displayVideo)

const getFormattedDuration = (duration = "") => {
    if (typeof(duration) != "string") return;
    let time = ["ч", "мин", "сек"];

    let re = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/;
    let reObj = re.exec('PT13M07S');
    if (rslt[1] === undefined && rslt[2] === undefined && rslt[1] === undefined) return;

    let rslt = reObj.slice(1,4).map((item, index) => {
        if (typeof(item) === "undefined") return; 
        else return item + ` ${time[index]}`
    });
    return rslt.join(" ");
}