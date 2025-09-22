import React from 'react';
import styled from 'styled-components';

const Loader = () => {
  return (
    <StyledWrapper>
      <div className="loader-wrapper">
        <span className="loader-letter">E</span>
        <span className="loader-letter">M</span>
        <span className="loader-letter">B</span>
        <span className="loader-letter">R</span>
        <span className="loader-letter">E</span>
        <span className="loader-letter">V</span>
        <span className="loader-letter">E</span>
        <div className="loader" />
        <div className="star" />
        <div className="star" />
        <div className="star" />
        <div className="star" />
        <div className="star" />
        <div className="star" />
        <div className="star" />
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .loader-wrapper {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100px;
    height: 100px;
    font-family: "Inter", sans-serif;
    font-size: 1.2em;
    font-weight: 600;
    color: #fff;
    border-radius: 50%;
    background-color: #f051;
    box-shadow: 0 0 60px -10px #fff5;
    user-select: none;
  }

  .loader {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    aspect-ratio: 1 / 1;
    border-radius: 50%;
    background-color: transparent;
    animation: loader-rotate 2s linear infinite;
    z-index: 0;
  }

  @keyframes loader-rotate {
    0% {
      transform: rotate(90deg);
      box-shadow:
        0 10px 20px 0 #fff inset,
        0 20px 30px 0 #fff5 inset,
        0 60px 60px 0 #f001 inset;
    }
    50% {
      transform: rotate(270deg);
      box-shadow:
        0 10px 20px 0 #fff inset,
        0 20px 10px 0 #fa09 inset,
        0 40px 60px 0 #f002 inset;
    }
    100% {
      transform: rotate(450deg);
      box-shadow:
        0 10px 20px 0 #fff inset,
        0 20px 30px 0 #fff5 inset,
        0 60px 60px 0 #f001 inset;
    }
  }

  .loader-letter {
    display: inline-block;
    opacity: 0.4;
    transform: translateY(0);
    animation: loader-letter-anim 2s infinite;
    z-index: 1;
    border-radius: 50ch;
    border: none;
    filter: blur(2px);
    margin: 0.35em;
  }

  .loader-letter:nth-child(1) {
    animation-delay: 0s;
  }
  .loader-letter:nth-child(2) {
    animation-delay: 0.1s;
  }
  .loader-letter:nth-child(3) {
    animation-delay: 0.2s;
  }
  .loader-letter:nth-child(4) {
    animation-delay: 0.3s;
  }
  .loader-letter:nth-child(5) {
    animation-delay: 0.4s;
  }
  .loader-letter:nth-child(6) {
    animation-delay: 0.5s;
  }
  .loader-letter:nth-child(7) {
    animation-delay: 0.6s;
  }

  @keyframes loader-letter-anim {
    0%,
    100% {
      opacity: 0;
      transform: translateY(0);
      filter: blur(2px);
    }
    20% {
      opacity: 1;
      transform: scale(1.2) translateY(-1px);
      filter: blur(0px);
      text-shadow:
        0px 0px 2px #fff,
        0px 0px 6px #000;
    }
    40% {
      opacity: 0.7;
      transform: translateY(0);
      filter: blur(2px);
    }
  }

  .star {
    position: absolute;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: #fff;
    transform: translate(20px, 90px);
    animation: blur-anim 2s infinite;
    box-shadow: 0 0 8px 0 #fff;
    filter: blur(4px);
    opacity: 0.2;
  }

  .star:nth-of-type(2) {
    transform: translate(56px, 46px);
    scale: 1.05;
    animation-delay: 0.2s;
  }
  .star:nth-of-type(3) {
    transform: translate(-26px, 56px);
    scale: 1.4;
    animation-delay: 0.4s;
  }
  .star:nth-of-type(4) {
    transform: translate(-50px, -70px);
    scale: 0.95;
    animation-delay: 0.7s;
  }
  .star:nth-of-type(5) {
    transform: translate(32px, -66px);
    scale: 1.3;
    animation-delay: 0.35s;
  }
  .star:nth-of-type(6) {
    transform: translate(82px, -36px);
    scale: 1;
    animation-delay: 0.9s;
  }
  .star:nth-of-type(7) {
    transform: translate(-92px, 26px);
    scale: 1;
    animation-delay: 0.95s;
  }

  @keyframes blur-anim {
    0%,
    100% {
      opacity: 0.2;
      filter: blur(4px);
    }
    50% {
      opacity: 0.3;
      filter: blur(1px);
    }
  }`;

export default Loader;
