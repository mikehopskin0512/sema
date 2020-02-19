import withLayout from '../components/layout';
import ReactSelect from 'react-select';

const repos = [
  { label: 'Lorem', value: 1},
  { label: 'Impsum', value: 2},
  { label: 'Dolor', value: 3},
	{ label: 'Sit', value: 4},
  { label: 'Amet', value: 5}
];

const committers = [
  { label: 'Jane Doe', value: 1},
  { label: 'John Doe', value: 2},
  { label: 'Chris Smith', value: 3}
];

const filetypes = [
	{ label: 'Java', value: 1},
	{ label: 'Python', value: 2},
	{ label: 'JavaScript', value: 3},
	{ label: 'TypeScript', value: 4},
	{ label: 'C', value: 5},
	{ label: 'C++', value: 6},
	{ label: 'C#', value: 7},
	{ label: 'Ruby', value: 8},
	{ label: 'Swift', value: 9}
];

const Reports = () => (

<section className='Reports'>
	<nav className="navbar is-transparent ">
		<div className="navbar-brand">
			<div className="navbar-burger burger" data-target="navbarExampleTransparentExample">
				<span></span>
				<span></span>
				<span></span>
			</div>
		</div>

		<div id="navbarExampleTransparentExample"  className="navbar-menu">
			<div className="navbar-start">

				<div className="navbar-item">
						<ReactSelect 
							isMulti 
							hideSelectedOptions={true} 
							options={repos}  
							placeholderButtonLabel="Repositories"
						/>
				</div>

				<div className="navbar-item">
					<ReactSelect 
						isMulti 
						hideSelectedOptions={true} 
						options={committers}  
						placeholderButtonLabel="Committers"
					/>
				</div>

				<div className="navbar-item">
					<ReactSelect 
						isMulti 
						hideSelectedOptions={true} 
						options={filetypes} 
						placeholderButtonLabel="FileTypes"
					/>
				</div>

				<div className="navbar-item">
					<div className="select">
						<select>
							<option selected disabled>Date Range</option>
							<option value="1">Past Day</option>
							<option value="7">Past 7 Days</option>
							<option value="14">Past 14 Days</option>
							<option value="30">Past 30 Days</option>
							<option value="60">Past 60 Days</option>
							<option value="90">Past 90 Days</option>
							<option value="180">Past 180 Days</option>
							<option value="365">Past Year</option>
						</select>
					</div>
				</div>
			</div>

			<div className="navbar-end">
				<div className="navbar-item">
					<div className="field is-grouped">
						<div className="control">
							<button className="button is-link">Submit</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</nav>
</section>   
);

export default withLayout(Reports);

// Another sample implementation with single select.
// const Reports = () => (

// <section className='Reports'>
// 	<nav className="navbar is-transparent ">
// 		<div className="navbar-brand">
// 			<div className="navbar-burger burger" data-target="navbarExampleTransparentExample">
// 				<span></span>
// 				<span></span>
// 				<span></span>
// 			</div>
// 		</div>

// 		<div id="navbarExampleTransparentExample"  className="navbar-menu">
// 			<div className="navbar-start">
// 				<div className="navbar-item">
// 					<div className="select">
// 						<select>
// 							<option selected disabled>Repositories</option>
// 							<option>Lorem</option>
// 							<option>ipsum</option>
// 							<option>dolor</option>
// 							<option>sit</option>
// 							<option>amet</option>
// 						</select>
// 					</div>
// 				</div>

// 				<div className="navbar-item">
// 					<div className="select">
// 						<select>
// 							<option selected disabled>Committers</option>
// 							<option>Jane Doe</option>
// 							<option>John Doe</option>
// 							<option>Chris Smith</option>
// 						</select>
// 					</div>
// 				</div>

// 				<div className="navbar-item">
// 					<div className="select">
// 						<select>
// 							<option selected disabled>File Types</option>
// 							<option>Java</option>
// 							<option>Python</option>
// 							<option>JavaScript</option>
// 							<option>TypeScript</option>
// 							<option>C</option>
// 							<option>C++</option>
// 							<option>C#</option>
// 							<option>Ruby</option>
// 							<option>Swift</option>
// 						</select>
// 					</div>
// 				</div>

// 				<div className="navbar-item">
// 					<div className="select">
// 						<select>
// 							<option selected disabled>Date Range</option>
// 							<option>Past Day</option>
// 							<option>Past 7 Days</option>
// 							<option>Past 14 Days</option>
// 							<option>Past 30 Days</option>
// 							<option>Past 60 Days</option>
// 							<option>Past 90 Days</option>
// 							<option>Past 180 Days</option>
// 							<option>Past Year</option>
// 						</select>
// 					</div>
// 				</div>
// 			</div>

// 			<div className="navbar-end">
// 				<div className="navbar-item">
// 					<div class="field is-grouped">
// 						<div class="control">
// 							<button class="button is-link">Submit</button>
// 						</div>
// 					</div>
// 				</div>
// 			</div>
// 		</div>
// 	</nav>
// </section>   
// );
// export default withLayout(Reports);