import React, { useContext } from 'react';
import { ColorContext } from '../../libraries/contexts';
import { outIf } from '../../misc/helpers';
import styles from '../../styles/scroll-to-top.module.css';
import $ from 'jquery';

type Props = {
	className?: string;
};

export default function ScrollToTop(props: Props) {
	const { background } = useContext(ColorContext);

	return (
		<div
			className={`${styles.container} d-flex align-items-center justify-content-center clickable ${props.className} ${outIf(
				background !== 'dark',
				styles['white-content']
			)}`}
			onClick={() => $('html,body').animate({ scrollTop: 0 }, 1000)}>
			<i className={`fas fa-chevron-up ${styles.fas}`}></i>
		</div>
	);
}
