import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Mail, Phone, MapPin, Heart } from 'lucide-react';
import logoImage from '@/assets/logo.png';

const Footer = () => {
  return (
    <footer className="bg-muted/30 border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <img 
                src={logoImage} 
                alt="Game2Grow" 
                className="w-10 h-10 rounded-lg"
              />
              <span className="text-xl font-bold text-gradient-primary">
                Game2Grow
              </span>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Empowering the next generation through gamified environmental education. 
              Learn, play, and make a difference for our planet.
            </p>
            <div className="flex items-center space-x-1 text-sm text-muted-foreground">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-500" />
              <span>for Smart India Hackathon</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Quick Links</h3>
            <nav className="flex flex-col space-y-2">
              <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">
                Home
              </Link>
              <Link to="/games" className="text-muted-foreground hover:text-primary transition-colors">
                Games
              </Link>
              <Link to="/achievements" className="text-muted-foreground hover:text-primary transition-colors">
                Achievements
              </Link>
              <Link to="/register" className="text-muted-foreground hover:text-primary transition-colors">
                Join Now
              </Link>
            </nav>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Categories</h3>
            <nav className="flex flex-col space-y-2">
              <span className="text-muted-foreground">Preschool (3-5 years)</span>
              <span className="text-muted-foreground">Middle School (6-10 years)</span>
              <span className="text-muted-foreground">High School (11-17 years)</span>
              <span className="text-muted-foreground">College (18+ years)</span>
            </nav>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Get in Touch</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Mail className="w-4 h-4 text-primary" />
                <span className="text-sm">info@game2grow.edu</span>
              </div>
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Phone className="w-4 h-4 text-primary" />
                <span className="text-sm">+91 12345 67890</span>
              </div>
              <div className="flex items-center space-x-2 text-muted-foreground">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="text-sm">Smart India Hackathon 2024</span>
              </div>
            </div>

            {/* Environmental Impact */}
            <div className="bg-primary/10 rounded-lg p-3">
              <div className="flex items-center space-x-2 mb-2">
                <Leaf className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium text-primary">Our Impact</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Join 10,000+ students learning to protect our environment through interactive games and challenges.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-muted-foreground">
              © 2024 Game2Grow. All rights reserved. Built for Smart India Hackathon.
            </p>
            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
              <Link to="#" className="hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <Link to="#" className="hover:text-primary transition-colors">
                Terms of Service
              </Link>
              <Link to="#" className="hover:text-primary transition-colors">
                Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;