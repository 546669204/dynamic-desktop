import styles from './page.module.css'


const Copyright = ({ filename }: { filename: string }) => {
  if (filename.split("-")[0] === 'wallhaven') {
    return (
      <div className={styles.copyright}>
        <a href="https://wallhaven.cc" target="_blank">
          <img src="https://wallhaven.cc/images/layout/logo.png" alt="" />
          <p>The best wallpapers on the Net!</p>
        </a>
      </div>
    )
  }
  if (filename.split("-")[0] === 'wallhaven') {
    return (
      <div className={styles.copyright}>
        <a href="https://pixabay.com/" target="_blank">
          <img src="https://pixabay.com/static/img/logo.svg" alt="" width="280" />
          <p> Free Images</p>
        </a>
      </div>
    )
  }
  return <div></div>
}

export default Copyright