/* eslint-disable */
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { session } from '../../libraries/session';
import { exists, outIf } from '../../misc/helpers';
import $ from 'jquery';
import { useHistory } from 'react-router-dom';
import { ColorContext } from '../../libraries/contexts';

type Props = {
	className?: string;
};

export type Settings = { [key: string]: string };

export default function Plugin(props: Props) {
	const { setColor, color, setBackground } = useContext(ColorContext);

	const setSetting = (key: string, value: string) =>
		session.set('settings', {
			...(session.get('settings') || {}),
			[key]: value,
		});

	const changeSidebarColor = (color: string) => {
		$('.full-page').attr('filter-color', color);
		$('body > .navbar-collapse').attr('data', color);
		setColor(color);
	};

	useEffect(() => {
		boot();
	}, []);

	return (
		<div className={`fixed-plugin ${props.className}`}>
			<div className='dropdown show-dropdown'>
				<div className='clickable' data-toggle='dropdown'>
					<i className='fas fa-cog fa-2x fa-spin'></i>
				</div>
				<ul className='dropdown-menu'>
					<li className='header-title'>Color Pallete</li>
					<li className='adjustments-line'>
						<div className='clickable'>
							<div className='badge-colors text-center'>
								<span
									className={`badge filter badge-primary ${outIf(color === 'primary', 'active')}`}
									onClick={() => {
										setSetting('background', 'pink');
										changeSidebarColor('primary');
									}}></span>
								<span
									className={`badge filter badge-info ${outIf(color === 'blue', 'active')}`}
									onClick={() => {
										setSetting('background', 'blue');
										changeSidebarColor('blue');
									}}></span>
								<span
									className={`badge filter badge-success ${outIf(color === 'green', 'active')}`}
									onClick={() => {
										setSetting('background', 'green');
										changeSidebarColor('green');
									}}></span>
							</div>
							<div className='clearfix'></div>
						</div>
					</li>
					<li className='adjustments-line text-center color-change mb-3'>
						<span className='color-label'>LIGHT MODE</span>{' '}
						<span
							className='badge light-badge mr-2'
							onClick={() => {
								setSetting('mode', 'light');
								setBackground('light');
							}}></span>
						<span
							className='badge dark-badge ml-2'
							onClick={() => {
								setSetting('mode', 'dark');
								setBackground('dark');
							}}></span>{' '}
						<span className='color-label'>DARK MODE</span>
					</li>
				</ul>
			</div>
		</div>
	);
}

function boot() {
	let sidebar_mini_active = true;
	let white_color = false;

	$('.fixed-plugin a').on('click', function (event) {
		if ($(this).hasClass('switch-trigger')) {
			if (event.stopPropagation) {
				event.stopPropagation();
			} else if (window.event) {
				window.event.cancelBubble = true;
			}
		}
	});

	$('.switch-sidebar-mini input').on('switchChange.bootstrapSwitch', function () {
		var $btn = $(this);

		if (sidebar_mini_active == true) {
			$('body').removeClass('sidebar-mini');
			sidebar_mini_active = false;
			(window as any).blackDashboard.showSidebarMessage('Sidebar mini deactivated...');
		} else {
			$('body').addClass('sidebar-mini');
			sidebar_mini_active = true;
			(window as any).blackDashboard.showSidebarMessage('Sidebar mini activated...');
		}

		// we simulate the window Resize so the charts will get updated in realtime.
		var simulateWindowResize = setInterval(function () {
			window.dispatchEvent(new Event('resize'));
		}, 180);

		// we stop the simulation of Window Resize after the animations are completed
		setTimeout(function () {
			clearInterval(simulateWindowResize);
		}, 1000);
	});

	$('.switch-change-color input').on('switchChange.bootstrapSwitch', function () {
		var $btn = $(this);

		if (white_color == true) {
			$('body').addClass('change-background');
			setTimeout(function () {
				$('body').removeClass('change-background');
				$('body').removeClass('white-content');
			}, 900);
			white_color = false;
		} else {
			$('body').addClass('change-background');
			setTimeout(function () {
				$('body').removeClass('change-background');
				$('body').addClass('white-content');
			}, 900);

			white_color = true;
		}
	});
}
