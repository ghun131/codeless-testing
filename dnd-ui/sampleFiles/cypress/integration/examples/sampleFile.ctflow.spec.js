
		/// <reference types="cypress" />

		context('Generated By Ctflow', () => {
			it('Demo CtFlow', () => {
				
      cy.visit('https://planetscale.com/')
    

    cy.get('#user_email').type('hungdh131@gmail.com')
    

    cy.get('#user_password').type('thisisthepassword')
    

    cy.get('#user_password_confirmation').type('thisisthepassword')
    

    cy.get('#tos').click()
    

    cy.get('.btn .btn-primary .w-full').click()
    

			})
		})
		