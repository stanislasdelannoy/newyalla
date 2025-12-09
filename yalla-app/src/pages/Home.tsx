import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { getTrips } from "../api/trips"
import { TripCard } from "../components/TripCard"

export default function Home() {
  const [trips, setTrips] = useState<any[]>([])
  const slogans = [
    "family trip to Barcelona",
    "lovers getaway to Paris",
    "bachelor party in Berlin",
    "shopping in Milan",
    "weekend in London",
  ]
  const [sloganIndex, setSloganIndex] = useState(0)

  useEffect(() => {
    getTrips().then((data) => {
      // backend might return { results: [...] } or an array — adapt if needed
      setTrips(Array.isArray(data) ? data : data.results || [])
    }).catch(console.error)
  }, [])

  useEffect(() => {
    if (window.matchMedia("(min-width: 768px)").matches) {
      const id = setInterval(() => setSloganIndex((i) => (i + 1) % slogans.length), 4000)
      return () => clearInterval(id)
    }
  }, [])

  return (
    <div>
      {/* HERO */}
      <section
        id="home"
        className="module-hero module-parallax module-fade module-full-height bg-dark-30"
        style={{
          backgroundImage: `url(/images/background.jpg)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          color: "white",
          padding: "6rem 0",
        }}
      >
        <div className="hs-caption container">
          <div className="caption-content">
            <div className="hs-title-size-4 font-alt m-b-30">
              <div>Plan your very own</div>
              <div id="slogan">{slogans[sloganIndex]}</div>
            </div>

            <div className="hs-title-size-2 font-alt m-b-30">
              <div>Prepare a tailor-made trip to any city</div>
              <div>with only your own addresses</div>
            </div>

            <div className="buttons_home text-center">
              <Link className="btn btn-success btn-lg" to="/trips/new">START YOUR TRIP</Link>
              <Link className="btn btn-primary btn-lg" to="/trips">EXPLORE THE WORLD</Link>
            </div>
          </div>
        </div>
      </section>

      <div className="wrapper">
        {/* WHAT WE DO */}
        <section className="module-small background-grey">
          <div className="container">
            <div className="row">
              <div className="col-xs-12 text-center">
                <h2 className="module-title no-margin font-alt">How does Yala work ?</h2>
              </div>

              {/* four boxes */}
              <div className="col-xs-12 col-sm-6">
                <div className="content-box mini-h-padding">
                  <div className="content-box-icon">
                    <img src="/images/home/home_how_to-1s.png" className="image-screenshot" alt="" />
                  </div>
                  <div className="content-box-title font-inc font-uppercase">
                    <h5>Explore week-ends around the world</h5>
                  </div>
                  <div className="content-box-text text-left mini-b-padding">
                    <ul>
                      <li>Filter by location or type</li>
                      <li>See stars and activities</li>
                      <li>Like your favorite trips</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="col-xs-12 col-sm-6">
                <div className="content-box mini-h-padding">
                  <div className="content-box-icon">
                    <img src="/images/home/home_how_to-3s.png" className="image-screenshot" alt="" />
                  </div>
                  <div className="content-box-title font-inc font-uppercase">
                    <h5>Take your trips with you</h5>
                  </div>
                  <div className="content-box-text text-left mini-b-padding">
                    <ul>
                      <li>Beautiful summary showing daily planning</li>
                      <li>Browse other people's trip and add activities to your's</li>
                      <li>Access anytime anywhere</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="col-xs-12 col-sm-6">
                <div className="content-box mini-h-padding">
                  <div className="content-box-icon">
                    <img src="/images/home/home_how_to-2s.png" className="image-screenshot" alt="" />
                  </div>
                  <div className="content-box-title font-inc font-uppercase">
                    <h5>Add any type of activity and organize your days</h5>
                  </div>
                  <div className="content-box-text text-left mini-b-padding">
                    <ul>
                      <li>Find all the museums, restaurants, parks, streets in a click</li>
                      <li>Drag and Drop to organize day by day</li>
                      <li>Check the map in real time</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="col-xs-12 col-sm-6">
                <div className="content-box mini-h-padding">
                  <div className="content-box-icon">
                    <img src="/images/home/home_how_to-4s.png" className="image-screenshot" alt="" />
                  </div>
                  <div className="content-box-title font-inc font-uppercase">
                    <h5>Invite your friends</h5>
                  </div>
                  <div className="content-box-text text-left mini-b-padding">
                    <ul>
                      <li>Send invitation to your friends and let them add activities</li>
                      <li>Stop asking for recommendations by email, just add them to Yala!</li>
                      <li>Chat and keep every details of the organization in your trip(soon)</li>
                    </ul>
                  </div>
                </div>
              </div>
              {/* end boxes */}
            </div>
          </div>
        </section>

        {/* PORTFOLIO / Trips */}
        <section className="module-small p-b-0">
          <div className="container">
            <div className="row">
              <div className="col-xs-12 text-center">
                <h2 className="module-title no-margin font-alt">Browse our best trips</h2>
                <div className="mini-padded"></div>
              </div>
            </div>

            <ul id="works-grid" className="works-grid works-grid-4 works-hover-w" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 16, listStyle: "none", padding: 0 }}>
              {trips.map((t) => (
                <TripCard key={t.id} trip={t} />
              ))}
            </ul>
          </div>
        </section>

        {/* ABOUT + CONTACT simplified */}
        <section className="module module-small p-t-0 p-b-0 img_background" style={{ backgroundImage: "url(/images/about.jpg)", backgroundSize: "cover" }}>
          <div className="container-fluid container-height">
            <div className="row relative">
              <div className="col-xs-12 col-md-6 col-md-offset-6 col-bg">
                <h2 className="module-title font-alt">About</h2>
                <div className="module-subtitle font-inc">Create trips really tailor made and organize as you will</div>
                <p>When travelling for week ends or holidays, you want to enjoy each moment with things you really like to do...</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
