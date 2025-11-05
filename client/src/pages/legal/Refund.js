import React from 'react';
import './Legal.css';

const Refund = () => {
  return (
    <div className="legal-page">
      <div className="container">
        <div className="legal-content">
          <h1>Refund Policy</h1>
          <p className="last-updated">Last Updated: November 5, 2025</p>

          <section>
            <h2>1. General Policy</h2>
            <p>Due to the digital nature of our products, all sales are generally final. However, we understand that issues may arise, and we're committed to customer satisfaction.</p>
          </section>

          <section>
            <h2>2. Eligible Refund Scenarios</h2>
            <p>Refunds may be issued in the following cases:</p>
            
            <h3>Technical Issues:</h3>
            <ul>
              <li>Unable to download purchased image</li>
              <li>Corrupted or damaged file</li>
              <li>Wrong image delivered</li>
              <li>Image quality significantly different from preview</li>
            </ul>

            <h3>Duplicate Purchases:</h3>
            <ul>
              <li>Accidental double purchase of same image</li>
              <li>System error causing multiple charges</li>
            </ul>

            <h3>Fraudulent Transactions:</h3>
            <ul>
              <li>Unauthorized use of payment method</li>
              <li>Identity theft or fraud</li>
            </ul>

            <h3>Misleading Content:</h3>
            <ul>
              <li>Image significantly misrepresented</li>
              <li>Copyright infringement issues</li>
              <li>Inappropriate or illegal content</li>
            </ul>
          </section>

          <section>
            <h2>3. Non-Refundable Scenarios</h2>
            <p>Refunds will NOT be issued for:</p>
            <ul>
              <li>Change of mind after purchase</li>
              <li>Already downloaded images</li>
              <li>Buyer's remorse</li>
              <li>Found similar image elsewhere</li>
              <li>Didn't read image description properly</li>
              <li>Technical issues on buyer's end (device, software, etc.)</li>
            </ul>
          </section>

          <section>
            <h2>4. Refund Request Process</h2>
            <h3>Step 1: Contact Support</h3>
            <p>Email us at refunds@imagesbazaar.com within 7 days of purchase with:</p>
            <ul>
              <li>Order ID or transaction ID</li>
              <li>Image title and ID</li>
              <li>Detailed reason for refund</li>
              <li>Screenshots (if applicable)</li>
            </ul>

            <h3>Step 2: Review Process</h3>
            <ul>
              <li>We review your request within 2-3 business days</li>
              <li>May request additional information</li>
              <li>Decision communicated via email</li>
            </ul>

            <h3>Step 3: Refund Processing</h3>
            <ul>
              <li>Approved refunds processed within 5-7 business days</li>
              <li>Refunded to original payment method</li>
              <li>Email confirmation sent</li>
            </ul>
          </section>

          <section>
            <h2>5. Refund Timeline</h2>
            <ul>
              <li><strong>Request Review:</strong> 2-3 business days</li>
              <li><strong>Refund Processing:</strong> 5-7 business days</li>
              <li><strong>Bank Credit:</strong> 5-10 business days (varies by bank)</li>
              <li><strong>Total Time:</strong> Up to 20 business days</li>
            </ul>
          </section>

          <section>
            <h2>6. Partial Refunds</h2>
            <p>In some cases, we may offer partial refunds:</p>
            <ul>
              <li>Minor quality issues</li>
              <li>Delayed download access</li>
              <li>Partial service disruption</li>
            </ul>
          </section>

          <section>
            <h2>7. Contributor Impact</h2>
            <p>When a refund is issued:</p>
            <ul>
              <li>Contributor's earnings are adjusted</li>
              <li>If payout already made, amount deducted from future earnings</li>
              <li>Contributor notified of refund</li>
              <li>Dispute resolution process available</li>
            </ul>
          </section>

          <section>
            <h2>8. Chargebacks</h2>
            <p>If you initiate a chargeback:</p>
            <ul>
              <li>Your account may be suspended pending investigation</li>
              <li>Please contact us first before filing chargeback</li>
              <li>Chargeback fees may apply</li>
              <li>Account may be permanently banned for fraudulent chargebacks</li>
            </ul>
          </section>

          <section>
            <h2>9. Alternative Solutions</h2>
            <p>Instead of refund, we may offer:</p>
            <ul>
              <li>Store credit for future purchases</li>
              <li>Exchange for different image</li>
              <li>Technical support to resolve issues</li>
              <li>Re-download of corrupted files</li>
            </ul>
          </section>

          <section>
            <h2>10. Contact Information</h2>
            <p>For refund requests or questions:</p>
            <ul>
              <li><strong>Email:</strong> refunds@imagesbazaar.com</li>
              <li><strong>Phone:</strong> +91 1234567890</li>
              <li><strong>Hours:</strong> Monday-Friday, 9 AM - 6 PM IST</li>
              <li><strong>Response Time:</strong> Within 24-48 hours</li>
            </ul>
          </section>

          <section>
            <h2>11. Dispute Resolution</h2>
            <p>If you're not satisfied with our refund decision:</p>
            <ul>
              <li>Request escalation to senior support</li>
              <li>Provide additional evidence</li>
              <li>Final decision made within 7 business days</li>
              <li>Legal recourse available as per Indian law</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Refund;
