import { Quote } from '@/types/types';
import { memo } from 'react';

export const Quotes = memo(function Quotes({ quotes }: { quotes: Quote[] }) {
	return (
		<section className="p-4 w-1/2">
			<h2 className="text-3xl font-bold mb-4">名言集</h2>
			<ul className="space-y-6">
				{quotes.map((quote, index) => (
					<li key={index} className="bg-gray-100 p-4 rounded-lg">
						<p className="italic text-lg">{quote.meigen}</p>
						<div className="text-right mt-2">- {quote.auther}</div>
					</li>
				))}
			</ul>
		</section>
	);
});
