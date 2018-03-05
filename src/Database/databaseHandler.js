const sql = require('mssql')

const config = {
    user: 'TimeSpanDBMaster',
    password: 'ThisIsMyDatabaseForTimeSpan123',
    server: 'timespandb.ciebdulp1djc.us-east-1.rds.amazonaws.com', // You can use 'localhost\\instance' to connect to named instance
    database: 'TSGame',
    // port : '51060',
 
    options: {
        
    }
}
var pool = {}; 

function getTodaysDateWithoutTime()
{
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!
    var yyyy = today.getFullYear();
    
    if(dd<10) {
        dd = '0'+dd
    } 
    
    if(mm<10) {
        mm = '0'+mm
    } 
    
    today = mm + '/' + dd + '/' + yyyy;

    return today; 

}

module.exports = {

        connect: function ()
        {
            (async function () {
                try {

                
                    
              
                     pool = await sql.connect(config);
                    
                   // console.log("HERE"); 
                    // let result1 = await pool.request()
                    //     .input('UserId', sql.Int, 12)
                    //     .query('select * from [User] where UserId = @UserID')
                        
                   // console.log(result1);
                } catch (err) {
                    // ... error checks
                    console.log(err);
                }
            })()
             
            sql.on('error', err => {
                // ... error handler
            })
        },

        getUserById: async function(userId)
        {
            try {
                        
                let result1 = await pool.request()
                    .input('UserID', sql.Int,userId )
                    .query('select * from [User] where UserID = @UserID')
              
                    if(result1.recordset.length > 0)
                    {            
                        return result1.recordset[0];
                    }
                  
           
               // console.log(result1);
            } catch (err) {
                // ... error checks
                console.log(err);
            }
        
         
            sql.on('error', err => {
                // ... error handler
            })
        },

        userLogin: async function(userName, password)
        {
          
              
                    try {
                        
                        let result1 = await pool.request()
                            .input('UserName', sql.NVarChar(20),userName )
                            .input('UserPW', sql.NChar(6),password )
                            .query('select UserID from [User] where UserName = @UserName AND UserPW = @UserPW')
                      
                    
                            if(result1.recordset.length > 0)
                            {           
                               
                                return result1.recordset[0].UserID;
                            }
                          
                   
                       // console.log(result1);
                    } catch (err) {
                        // ... error checks
                        console.log(err);
                    }
                
                 
                sql.on('error', err => {
                    // ... error handler
                })
      

        },

        getTimeSpanMenuData: async function()
        {

            try {
                        
                let result1 = await pool.request()
                    .query('SELECT * FROM [TSGame].[dbo].[TimespanMenuView]')

                    if(result1.recordset.length > 0)
                    {
                       return result1.recordset; 
                    }
                    else{
                    }
                    
               // console.log(result1);
            } catch (err) {
                // ... error checks
                console.log(err);
            }


        },

        saveTimeSpan: async function(userId)
        {

            try {
                let result1 = await pool.request()
                        .input('UserID', sql.Int, userId)
                        .output('Result', sql.Int)
                        .execute('Insert_Time')

                    console.log(result1); 
                    
               // console.log(result1);
            } catch (err) {
                // ... error checks
                console.log(err);
            }


        },

        checkUserPlayedToday: async function(userId)
        {

            try {
                let result1 = await pool.request()
                .input('UserID', sql.Int,userId )
                .input('Game_Date', sql.Date,getTodaysDateWithoutTime())
                .query('select * from [Results] where User_ID = @UserID AND Game_Date = @Game_Date ')

                console.log(getTodaysDateWithoutTime());

                if(result1.recordset.length > 0)
                {
                   return true 
                }
                else{
                     return false; 
                }
                    
               // console.log(result1);
            } catch (err) {
                // ... error checks
                console.log(err);
            }


        }
            


        


}

        





       





