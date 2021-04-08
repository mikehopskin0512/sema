import withLayout from '@/components/layout';
import React from 'react';

const Invite = () => {
  console.log('test');
  return (
    <>
      <section className="hero">
        <div className="hero-body">
          <div className="container">
            <div className="tile is-ancestor">
              <div className="tile is-parent">
                <article className="tile is-child has-text-centered">
                  <p className="title">Welcome to Sema!</p>
                  <p className="subtitle">Aligned with the right tile</p>
                </article>
              </div>
            </div>
            <div className="tile is-ancestor">
              <div className="tile is-parent">
                <article className="tile is-child notification has-background-white has-text-centered">
                  <p className="title">You&apos;re almost there!</p>
                  <p className="subtitle">
                    The Sema Chrome Plugin allows us to modify the Github
                    commenting UI and supercharge your code review workflow
                  </p>
                  <div>Loader</div>
                  <button className="button has-background-black has-text-white">
                    Install Chrome Plugin
                  </button>
                </article>
              </div>
            </div>
            <p className="subtitle has-text-centered">
              Learn more about Sema while you wait...
            </p>
            <div className="tile is-ancestor">
              <div className="tile is-parent is-vertical">
                <div
                  className="tile is-child has-background-black img-filler"
                  style={{ width: 300, height: 150, display: 'block' }}
                />
                <article className="tile is-child has-text-centered">
                  <p className="title">Welcome to Sema!</p>
                  <p className="subtitle">Aligned with the right tile</p>
                </article>
              </div>
              <div className="tile is-parent">
                <article className="tile is-child has-text-centered">
                  <p className="title">Welcome to Sema!</p>
                  <p className="subtitle">Aligned with the right tile</p>
                </article>
              </div>
              <div className="tile is-parent">
                <article className="tile is-child has-text-centered">
                  <p className="title">Welcome to Sema!</p>
                  <p className="subtitle">Aligned with the right tile</p>
                </article>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default withLayout(Invite);
