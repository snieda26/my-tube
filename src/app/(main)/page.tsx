export default function HomePage() {
	return (
		<div>
			<div className="page-header">
				<h1 className="page-header__title">Welcome to MyTube</h1>
				<p className="page-header__subtitle">Discover, watch, and share videos</p>
			</div>

			<div className="video-grid">
				{/* Placeholder for video cards */}
				{Array.from({ length: 8 }).map((_, i) => (
					<div key={i} className="video-card">
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
							<span className="video-card__duration">12:34</span>
						</div>
						<div className="video-card__content">
							<h3 className="video-card__title">Sample Video Title #{i + 1}</h3>
							<p className="video-card__channel">Channel Name</p>
							<p className="video-card__meta">1.2K views • 2 days ago</p>
						</div>
					</div>
				))}
			</div>
		</div>
	)
}

