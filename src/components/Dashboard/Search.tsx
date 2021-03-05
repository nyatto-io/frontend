import $ from 'jquery';
import React, { FC } from 'react';
import { SearchBus } from '../../libraries/events';
import { session } from '../../libraries/session';

type Props = {};

const Search: FC<Props> = (props) => {
	const keywords = session.get<string[]>('searched-keywords') || [];
	return (
		<div
			className='modal modal-search fade'
			id='searchModal'
			tabIndex={-1}
			role='dialog'
			aria-labelledby='searchModal'
			aria-hidden='true'>
			<div className='modal-dialog' role='document'>
				<div className='modal-content'>
					<div className='modal-header'>
						<input
							type='text'
							className='form-control'
							id='inlineFormInputGroup'
							placeholder='SEARCH'
							onKeyUp={(e) => {
								e.preventDefault();
								if (e.key === 'Enter') {
									$('#searchModal').modal('hide');
									const keyword = (e.target as HTMLInputElement).value;
									SearchBus.dispatch('search', keyword);
									keywords.push(keyword);
									session.set('searched-keywords', keywords);
								}
							}}
							onChange={(e) => {
								SearchBus.dispatch('onChange', e);
							}}
							list='searchedKeywordList'
						/>
						<datalist id='searchedKeywordList'>
							{keywords.reverse().map((keyword, index) => (
								<option key={index}>{keyword}</option>
							))}
						</datalist>
						<button
							type='button'
							className='close'
							onClick={(e) => {
								e.preventDefault();
								$('#searchModal').modal('hide');
							}}
							aria-label='Close'>
							<i className='tim-icons icon-simple-remove'></i>
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Search;
