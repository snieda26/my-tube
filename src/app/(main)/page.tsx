export default function HomePage() {
  return (
    <div>
      <div className="page-header">
        <h1 className="page-heaer__title">Welcome to MyTube!</h1>
      </div>

      <div className="video-grid">
        {Array.from({ length: 12 }).map((_, i) => {
          return (
            <div className="vide-card" key={i}>
              <div className="video-card__thumbnail">
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(135deg, #252542 0%, #1a1a2e 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#52525b',
                  }}
                >
                  Video {i + 1}
                </div>
                <span className="video-card__duration">11:10</span>
              </div>
              <div className="video-card__content">
                <img
                  src={`https://i.pravatar.cc/36?img=${i + 1}`}
                  alt="Channel avatar"
                  className="video-card__avatar"
                  style={{ width: 36, height: 36, borderRadius: '50%' }}
                />
                <div className="video-card__info">
                  <h3 className="video-card__title">Test title #{i + 1}</h3>
                  <div className="video-card__channel">Channel name</div>
                  <p className="video-card__meta">
                    <span>1.2K views</span>
                    <span>2 days ago</span>
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
