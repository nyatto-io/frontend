import React, { FC } from 'react';
import { Paginated } from '../../../contracts/misc';
import Pagination from '../Pagination';
import SplashMini from '../SplashMini';
import Info from './Info';

type Props = {
	type: string;
	group: string;
	pagination: Paginated<any>;
	onPaginate: (url: string) => void;
	loaded: boolean;
};

const Container: FC<Props> = ({ loaded, onPaginate, pagination, children, type, group }) => {
	return (
		<div className='row'>
			<div className='col-12'>
				<Pagination pagination={pagination} onChange={onPaginate} />
			</div>
			<div className='col-12 col-md-8 col-xl-9'>
				{!loaded ? (
					<div className='h-100 d-flex align-items-center justify-content-center p-5'>
						<SplashMini />
					</div>
				) : (
					<div className='row'>{children}</div>
				)}
			</div>
			<div className='col-12 col-md-4 col-xl-3'>
				<Info type={type} group={group} />
			</div>
			<div className='col-12'>
				<Pagination pagination={pagination} onChange={onPaginate} />
			</div>
		</div>
	);
};

export default Container;
