// Copyright (c) 2022 Shreepad Shukla
// SPDX-License-Identifier: AGPL-3.0-only

use std::error::Error;

use clap::Parser;
use teams_info::Teams;

// Setup the command line arguments and help using Clap

/// Schedule hybrid work teams to ensure each team gets one day together in office
#[derive(Parser, Debug)]
#[clap(author, version, about, long_about = None)]
struct Args {
    /// Total number of seats
    #[clap(short, long, value_parser)]
    seats: u64,

    /// CSV filepath with team info
    #[clap(short, long, value_parser)]
    filepath: String,
}

// Worker function
fn find_optimal_seating(seats: u64, filepath: String) -> Result<u8, Box<dyn Error>> {
    println!("Finding optimal seating for {} seats using teams info from {}",
        seats,
        filepath
    );

    let teams = Teams::from_csv_file(filepath)?;

    for team in teams.teams_info.iter() {
        println!("Team: {:?}", team);
    }

    println!("Team combinations: {}", teams.combinations);

    println!("Pref seats at combination 0: {}", teams.prefseatcount_for_combination(0, seats));
    println!("Pref seats at combination 1: {}", teams.prefseatcount_for_combination(1, seats));
    println!("Pref seats at combination 62: {}", teams.prefseatcount_for_combination(62, seats));
    println!("Pref seats at combination 63: {}", teams.prefseatcount_for_combination(63, seats));

    Ok(0)
}

fn main() {
    let args = Args::parse();

    find_optimal_seating(args.seats, args.filepath);
}
