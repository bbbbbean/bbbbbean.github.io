package com.club.match.Domain.DTO;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@Data
public class PageDTO {

    private int page;
    private int perPage;
    private String order;
    private String field;
    private String filter;
    private int start;

    public PageDTO(){
        this.filter = "";
    }
}
