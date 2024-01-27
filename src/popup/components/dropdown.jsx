// AccordionComponent.js
import React, { useEffect } from 'react';
import './dropdown.css';

const AccordionComponent = () => {
  useEffect(() => {
    // JavaScript for accordion functionality
    const accordionTitles = document.querySelectorAll('.accordion-title');

    accordionTitles.forEach(title => {
      title.addEventListener('click', function () {
        const content = this.nextElementSibling;

        // Toggle active class on click
        this.parentNode.classList.toggle('active');

        // Toggle content visibility
        if (content.style.display === 'block') {
          content.style.display = 'none';
        } else {
          content.style.display = 'block';
        }
      });
    });
  }, []);

  return (
    <div className="accordion">
      <div className="accordion-section">
        <div className="accordion-title">Highlight Patterns</div>
        <div className="accordion-content">
          <center>
            Scarcity: 2
          </center>
          <footer>
            <button class="button" id="prev">Previous</button>
            <button class="button" id="next">Next</button>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default AccordionComponent;
