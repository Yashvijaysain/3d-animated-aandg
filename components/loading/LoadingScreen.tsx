"use client";

import Image from "next/image";
import styles from "./LoadingScreen.module.css";
import { usePageLoader } from "./usePageLoader";

export default function LoadingScreen() {
  const {
    rootRef,
    borderRef,
    ornamentRef,
    sideLeftRef,
    sideRightRef,
    brandRef,
    progressRef,
    footerRef,
    archRef,
    archImageRef
  } = usePageLoader();

  return (
    <div
      ref={rootRef}
      className={styles.loaderRoot}
      data-ag-loading-screen
      aria-label="A&G Realtors loading screen"
    >
      <div className={styles.loaderBackdrop} aria-hidden="true">
        <span>A&amp;G</span>
      </div>

      <div ref={borderRef} className={styles.loaderBorder} aria-hidden="true" />

      <div ref={ornamentRef} className={styles.ornament} aria-hidden="true">
        <Image
          className={styles.ornamentLogo}
          src="/ag-logo.png"
          alt=""
          width={420}
          height={142}
          priority
        />
      </div>

      <div ref={sideLeftRef} className={`${styles.sideWord} ${styles.sideLeft}`}>
        AGARWAL
      </div>
      <div ref={sideRightRef} className={`${styles.sideWord} ${styles.sideRight}`}>
        GEHLOT
      </div>

      <div ref={brandRef} className={styles.brandAssembly}>
        <span className={styles.brandLine}>A&amp;G</span>
        <span className={styles.brandTitle}>REALTORS</span>
      </div>

      <div ref={progressRef} className={styles.progressLine} aria-hidden="true" />

      <div ref={footerRef} className={styles.footerCaption}>
        <span>A&amp;G REALTORS</span>
        <span>WHERE EVERY JOURNEY LEADS HOME</span>
      </div>

      <div ref={archRef} className={styles.archWindow} aria-hidden="true">
        <div ref={archImageRef} className={styles.archImage} />
      </div>
    </div>
  );
}
