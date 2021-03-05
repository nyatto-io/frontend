import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from '../../styles/sidebar.module.css';

type Props = {
	to: string;
	icon: string;
	title: string;
	exact: boolean;
};

export default function RouterLink(props: Props) {
	return (
		<li>
			<NavLink to={props.to} activeClassName={`${styles.active}`} exact={props.exact}>
				<i className={props.icon}></i>
				<p>{props.title}</p>
			</NavLink>
		</li>
	);
}
