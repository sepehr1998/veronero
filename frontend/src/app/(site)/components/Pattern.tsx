"use client";
import React, { ReactNode } from "react";
import styled from "styled-components";

type PatternProps = {
    children?: ReactNode;
};

const Pattern = ({ children }: PatternProps) => {
    return (
        <StyledWrapper>
            <div className="pattern-container py-50">{children}</div>
        </StyledWrapper>
    );
};

const StyledWrapper = styled.div`
    width: 100%;
    position: relative;

    .pattern-container {
        position: relative;
        width: 100%;
        min-height: 100%;
        z-index: 0;
        background-color: #000;
        background-image: radial-gradient(
                4px 100px at 0px 235px,
                #09f,
                #0000
        ),
        radial-gradient(4px 100px at 300px 235px, #09f, #0000);
        background-size: 300px 235px;
        animation: hi 150s linear infinite;
    }

    .pattern-container::after {
        content: "";
        position: absolute;
        inset: 0;
        z-index: -1;
        pointer-events: none;
        background-image: radial-gradient(
                circle at 50% 50%,
                #0000 0,
                #0000 2px,
                hsl(0 0% 4%) 2px
        );
        background-size: 8px 8px;
        --f: blur(1em) brightness(6);
        animation: hii 10s linear infinite;
    }

    @keyframes hi {
        from {
            background-position: 0px 0px;
        }
        to {
            background-position: 0px 6800px;
        }
    }

    @keyframes hii {
        0% {
            backdrop-filter: var(--f) hue-rotate(0deg);
        }
        to {
            backdrop-filter: var(--f) hue-rotate(360deg);
        }
    }
`;

export default Pattern;
