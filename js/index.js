const API_KEY = "";
const VIDEOS_URL = 'https://www.googleapis.com/youtube/v3/videos'
const SEARCH_URL = 'https://www.googleapis.com/youtube/v3/search'

const videoListItems = document.querySelector('.video-list__items');

const favoriteIDs = JSON.parse(localStorage.getItem('favorite') || "[]")

const convertISOReadableDuration = (isoDuration) =>
{
    const time = ["ч", "мин", "сек"];
    const re = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/;
    const reObj = re.exec(isoDuration);
    const result = reObj.slice(1,4).map((item, index) => {
        if (item === undefined) return;
        return item + ` ${time[index]}`
    }).join(" ");
    return result;
}

const formatPremierDate = (isoString) =>{
    const date = new Date(isoString);
    const formatter = new Intl.DateTimeFormat('ru-RU', {
        day:"numeric",
        month: 'short',
        year: "numeric"
    });
    return formatter.format(date);
}


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

const fetchFavoriteVideos = async () => {
    try {
        if (favoriteIDs.length === 0) 
        {
            return {items: []};
        }

        const url = new URL(VIDEOS_URL);
        url.searchParams.append('part', 'contentDetails,id,snippet');
        url.searchParams.append('key', API_KEY);
        url.searchParams.append('maxResults', 12);
        url.searchParams.append('id', favoriteIDs.join(','));

        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.log('error:', error);
    }
    return null;
}

const fetchVideoData = async (id) => {
    try {
        const url = new URL(VIDEOS_URL);
        url.searchParams.append('part', 'snippet,statistics');
        url.searchParams.append('key', API_KEY);
        url.searchParams.append('id', id);

        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.log('error:', error);
    }
    return null;
}

const fetchSearchVideos = async (queryString) => {
    try {
        const url = new URL(SEARCH_URL);
        url.searchParams.append('part', 'snippet');
        url.searchParams.append('q', queryString);
        url.searchParams.append('type', "video");
        url.searchParams.append('key', API_KEY);        

        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.log('error:', error);
    }
    return null;
}


const displayListVideo = (videos, isSearchVideos = true, currentVideoID = "") =>
{
    let listVideos = videos.items.map(video => {
        if (video.id.videoId === currentVideoID) return undefined;
        const li = document.createElement('li');
        li.classList.add('video-list__item');
        li.innerHTML = ` <article class="video-card">
            <a href="video.html?id=${video.id.videoId || video.id}" class="video-card__link">
                <img src="${video.snippet.thumbnails.standart?.url ||
                video.snippet.thumbnails.high?.url}" 
                alt="Превью видео ${video.snippet.title}" 
                class="video-card__thumbnail">
                <h3 class="video-card__title">${video.snippet.title}</h3>
                <p class= "video-card__channel">${video.snippet.channelTitle}</p>`

                if (!isSearchVideos)
                {
                    li.innerHTML += `<p class= "video-card__duration">
                    ${convertISOReadableDuration(video.contentDetails.duration)}
                    </p>`
                }

            li.innerHTML += `</a>
            <button class="video-card__favorite favorite
            ${favoriteIDs.includes(video.id) ? "active" : ""}" 
            type="button" 
            aria-label="Добавить в избранное, ${video.snippet.title}" data-video-id="${video.id.videoId || video.id}">
                <svg class="video-card__icon">
                    <use class="star-o" xlink:href="image/sprite.svg#star-w"></use>
                    <use class="star" xlink:href="image/sprite.svg#star"></use>
                </svg>
            </button>
        </article>`;
        return li;
    });

    listVideos = listVideos.filter(elem => elem != undefined);
    videoListItems.append(...listVideos);
}

const displayVideo = ({items:[video]}) => {
    const videoElem = document.querySelector('.video');
    videoElem.innerHTML = `<div class="container">
        <div class="video__player">
            <iframe class="video__iframe" width="560" height="315" 
            src="https://www.youtube.com/embed/${video.id}" 
            title="YouTube video player" 
            frameborder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; 
            gyroscope; picture-in-picture; web-share" 
            allowfullscreen></iframe>
        </div>
        <div class="video__container">
            <div class="video__about">
                <h3 class="video__title">${video.snippet.title}</h3>
                <p class="video__channel">${video.snippet.channelTitle}</p>
                <p class="video__info">
                    <span class="video__views">${parseInt(video.statistics.viewCount).toLocaleString()} просмотров </span>
                    <span class="video__premier-date">Дата премьеры: ${formatPremierDate(video.snippet.publishedAt)}</span>
                </p>
                <p class="video__description">
                    ${video.snippet.description}
                </p>
            </div>
            <button type="button" class="video__link ${favoriteIDs.includes(video.id) ? "active" : ""} favorite" data-video-id="${video.id}">
                <span class="video__no-favorite">В избранное</span>
                <span class="video__favorite">В избранном</span>
                <svg class="video__icon">
                    <use xlink:href="image/sprite.svg#star-w"></use>
                    <use class="star" xlink:href="image/sprite.svg#star"></use>
                </svg>
            </button>
        </div>
    </div>`
    return video.snippet.title;
}


const init = () => {
    const currentPage = location.pathname.split('/').pop();
    const urlSearchParams = new URLSearchParams(location.search);
    const videoId = urlSearchParams.get('id');
    const searchQuery = urlSearchParams.get('q');
    console.log(searchQuery);
    if (currentPage === "index.html" || currentPage === '')
    {
        fetchTrendingVideos().then(displayListVideo);
    }else if(currentPage === "video.html" && videoId)
    {
        fetchVideoData(videoId)
        .then(displayVideo)
        .then(fetchSearchVideos)
        .then((result) => {return displayListVideo(result, true, videoId)});
    } else if(currentPage === "favorite.html")
    {
        fetchFavoriteVideos().then(displayListVideo);
    } else if (currentPage === "search.html" && searchQuery)
    {
        fetchSearchVideos(searchQuery).then(displayListVideo);
    }

    document.body.addEventListener('click', ({target}) => {
        const itemFavorite = target.closest(".video__link") ?? target.closest(".video-card__favorite");
        if (itemFavorite)
        {
            const videoId = itemFavorite.dataset.videoId;

            if (favoriteIDs.includes(videoId))
            {
                favoriteIDs.splice(favoriteIDs.indexOf(videoId), 1);
                localStorage.setItem('favorite', JSON.stringify(favoriteIDs));
                itemFavorite.classList.remove('active');
            }else{
                favoriteIDs.push(videoId);
                localStorage.setItem('favorite', JSON.stringify(favoriteIDs));
                itemFavorite.classList.add('active');
            }
        }
    });
}

init();